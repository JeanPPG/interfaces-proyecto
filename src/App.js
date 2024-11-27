import React, { useState, useEffect, useRef } from 'react';
import MiniJuegos from './components/MiniGames';
import Results from './components/Results';
import './App.css';

/* global GazeRecorderAPI */

const App = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isMiniGameActive, setIsMiniGameActive] = useState(false);
  const [sessionData, setSessionData] = useState({});
  const [faceDetected, setFaceDetected] = useState(false); // Estado para la detección de rostro
  const videoRef = useRef(null); // Referencia para el video
  const canvasRef = useRef(null); // Referencia para el canvas
  const [stopMorphcastFn, setStopMorphcastFn] = useState(null);
  const stopGazeRecorderFn = useRef(null);

  // Cargar y configurar OpenCV.js
  useEffect(() => {
    if (window.cv) {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const context = canvasElement.getContext('2d');
      
      // Cargar el clasificador Haar Cascade para la detección de rostros
      const faceCascade = new window.cv.CascadeClassifier();
      faceCascade.load('haarcascade_frontalface_default.xml');

      // Función de detección de rostros
      const detectFace = () => {
        if (videoElement && context) {
          context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          const frame = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const mat = window.cv.matFromImageData(frame);
          const grayMat = new window.cv.Mat();
          window.cv.cvtColor(mat, grayMat, window.cv.COLOR_RGBA2GRAY);

          const faces = new window.cv.RectVector();
          faceCascade.detectMultiScale(grayMat, faces);

          if (faces.size() > 0) {
            setFaceDetected(true);
          } else {
            setFaceDetected(false);
          }

          mat.delete();
          grayMat.delete();
          faces.delete();
        }
      };

      // Iniciar la detección de rostros cada 100ms para optimización de recursos
      const intervalId = setInterval(detectFace, 100);

      // Limpiar el intervalo cuando el componente se desmonte
      return () => {
        clearInterval(intervalId);
      };
    }
  }, []);

  // Manejo de la cámara
  useEffect(() => {
    if (cameraEnabled) {
      const initCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      };

      initCamera();

      return () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      };
    }
  }, [cameraEnabled]);

  /**
   * Guardar los datos de sesión en un archivo JSON descargable
   * @param {Object} data
   */
  const saveSessionData = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `session_data_${new Date().toISOString()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Enviar datos al backend
   * @param {Object} data
   */
  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log('Datos enviados correctamente al backend.');
      } else {
        console.error('Error al enviar datos al backend.');
      }
    } catch (error) {
      console.error('Error en la conexión con el backend:', error);
    }
  };

  /**
   * Iniciar el servicio de Morphcast
   * @returns {Function}
   */
  const startMorphcast = async () => {
    const scriptLoader = (src, config = null) =>
      new Promise((resolve) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = resolve;
        if (config) script.setAttribute('data-config', config);
        script.src = src;
        document.head.appendChild(script);
      });

    await scriptLoader('https://sdk.morphcast.com/mphtools/v1.1/mphtools.js', 'compatibilityUI, compatibilityAutoCheck');
    await scriptLoader('https://ai-sdk.morphcast.com/v1.16/ai-sdk.js');

    const CY = window.CY;
    const loader = CY.loader();

    loader
      .licenseKey('sk52c05b0d7a4c86845903a5f3e556f024c07299241fd3')
      .addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.4 })
      .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
      .addModule(CY.modules().DATA_AGGREGATOR.name, { initialWaitMs: 2000, periodMs: 1000 });

    const { start, stop } = await loader.load();
    start();
    window.addEventListener(CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);

    return stop;
  };

  /**
   * Detener Morphcast
   * @param {Function} stop
   */
  const stopMorphcast = (stop) => {
    if (stop) {
      stop();
      window.removeEventListener(window.CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    }
  };

  /**
   * Manejar los datos de Morphcast
   * @param {Object} e
   */
  const handleMorphcastData = (e) => {
    setSessionData((prevData) => ({
      ...prevData,
      morphcast: [...(prevData.morphcast || []), e.detail],
    }));
  };

  /**
   * Iniciar GazeRecorder
   * @returns {Function}
   */
  const startGazeRecorder = () => {
    const script = document.createElement('script');
    script.src = 'https://app.gazerecorder.com/GazeRecorderAPI.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      GazeRecorderAPI.Rec();
    };

    script.onerror = () => console.error('Failed to load GazeRecorder script');

    return () => {
      GazeRecorderAPI.StopRec();
      const gazeData = GazeRecorderAPI.GetRecData();
      setSessionData((prevData) => ({
        ...prevData,
        gazeRecorder: gazeData,
      }));
    };
  };

  useEffect(() => {
    if (cameraEnabled) {
      startMorphcast().then((stop) => setStopMorphcastFn(() => stop));
      stopGazeRecorderFn.current = startGazeRecorder();
    } else {
      if (stopMorphcastFn) stopMorphcast(stopMorphcastFn);
      if (stopGazeRecorderFn.current) stopGazeRecorderFn.current();
      if (Object.keys(sessionData).length > 0) {
        saveSessionData(sessionData);
        sendDataToBackend(sessionData);
      }
    }
  }, [cameraEnabled]);

  return (
    <div className={`app ${isMiniGameActive ? 'mini-game-active' : ''}`}>
      {!isMiniGameActive && (
        <div className="left-column">
          <Results setCameraEnabled={setCameraEnabled} cameraEnabled={cameraEnabled} />
        </div>
      )}

      {cameraEnabled && !isMiniGameActive && (
        <div className="right-column">
          <MiniJuegos onGameStart={() => setIsMiniGameActive(true)} />
        </div>
      )}

      {isMiniGameActive && (
        <div className="mini-game-container">
          <MiniJuegos onGameEnd={() => setIsMiniGameActive(false)} />
        </div>
      )}

      <div className="video-container">
        <video ref={videoRef} width="640" height="480" autoPlay />
        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
        <p>{faceDetected ? 'Rostro Detectado' : 'No se detecta rostro'}</p>
      </div>
    </div>
  );
};

export default App;
