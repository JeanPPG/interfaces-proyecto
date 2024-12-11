import React, { useState, useEffect, useRef } from 'react';
import MiniJuegos from './components/MiniGames';
import Results from './components/Results';
import './App.css';

/* global GazeRecorderAPI */

const App = () => {
  // Estado para habilitar/deshabilitar la cámara
  const [cameraEnabled, setCameraEnabled] = useState(false);
  // Estado para controlar si el minijuego está activo
  const [isMiniGameActive, setIsMiniGameActive] = useState(false);
  // Estado para almacenar datos de sesión (como datos de Morphcast y GazeRecorder)
  const [sessionData, setSessionData] = useState({});

  /**
   * Guarda los datos de sesión en un archivo JSON descargable.
   * @param {Object} data - Datos de la sesión a guardar.
   */
  const saveSessionData = (data) => {
    // Send session data to App.py
    fetch('http://localhost:5000/save_session_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
  };

  /**
   * Inicia el servicio de Morphcast cargando los módulos necesarios.
   * @returns {Function} - Función para detener Morphcast.
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

    // Carga los scripts necesarios para Morphcast
    await scriptLoader('https://sdk.morphcast.com/mphtools/v1.1/mphtools.js', 'compatibilityUI, compatibilityAutoCheck');
    await scriptLoader('https://ai-sdk.morphcast.com/v1.16/ai-sdk.js');

    const CY = window.CY;
    const loader = CY.loader();

    // Configura los módulos de Morphcast
    loader
      .licenseKey('sk52c05b0d7a4c86845903a5f3e556f024c07299241fd3') // Clave de licencia
      .addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.4 }) // Modulo de emociones
      .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 }) // Modulo de atención
      .addModule(CY.modules().DATA_AGGREGATOR.name, { initialWaitMs: 2000, periodMs: 1000 }); // Agregador de datos

    const { start, stop } = await loader.load();
    start(); // Inicia Morphcast
    window.addEventListener(CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);

    return stop; // Devuelve la función para detener Morphcast
  };

  /**
   * Detiene el servicio de Morphcast y elimina los eventos asociados.
   * @param {Function} stop - Función para detener Morphcast.
   */
  const stopMorphcast = (stop) => {
    if (stop) {
      stop();
      window.removeEventListener(window.CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    }
  };

  /**
   * Maneja los datos recibidos de Morphcast.
   * @param {Object} e - Evento con datos de Morphcast.
   */
  const handleMorphcastData = (e) => {
    setSessionData((prevData) => ({
      ...prevData,
      morphcast: [...(prevData.morphcast || []), e.detail],
    }));
  };

  /**
   * Inicia el servicio de GazeRecorder para grabar datos de seguimiento ocular.
   * @returns {Function} - Función para detener GazeRecorder y obtener los datos.
   */
  const startGazeRecorder = () => {
    const script = document.createElement('script');
    script.src = 'https://app.gazerecorder.com/GazeRecorderAPI.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      GazeRecorderAPI.Rec(); // Inicia la grabación
    };

    script.onerror = () => console.error('Failed to load GazeRecorder script');

    return () => {
      GazeRecorderAPI.StopRec(); // Detiene la grabación
      const gazeData = GazeRecorderAPI.GetRecData(); // Obtiene los datos grabados
      setSessionData((prevData) => ({
        ...prevData,
        gazeRecorder: gazeData,
      }));
    };
  };

  // Guarda la función para detener Morphcast
  const [stopMorphcastFn, setStopMorphcastFn] = useState(null);
  // Ref para almacenar la función de detener GazeRecorder
  const stopGazeRecorderFn = useRef(null);

  /**
   * Maneja los cambios en el estado de la cámara. Inicia o detiene los servicios según sea necesario.
   */
  useEffect(() => {
    if (cameraEnabled) {
      startMorphcast().then((stop) => setStopMorphcastFn(() => stop));
      stopGazeRecorderFn.current = startGazeRecorder();
    } else {
      if (stopMorphcastFn) stopMorphcast(stopMorphcastFn);
      if (stopGazeRecorderFn.current) stopGazeRecorderFn.current();
      if (Object.keys(sessionData).length > 0) saveSessionData(sessionData);
    }
  }, [cameraEnabled]);

  return (
    <div className={`app ${isMiniGameActive ? 'mini-game-active' : ''}`}>
      {/* Columna izquierda: Mostrar resultados si no hay un minijuego activo */}
      {!isMiniGameActive && (
        <div className="left-column">
          <Results setCameraEnabled={setCameraEnabled} cameraEnabled={cameraEnabled} />
        </div>
      )}

      {/* Columna derecha: Mostrar minijuegos cuando la cámara está activa */}
      {cameraEnabled && !isMiniGameActive && (
        <div className="right-column">
          <MiniJuegos onGameStart={() => setIsMiniGameActive(true)} />
        </div>
      )}

      {/* Contenedor del minijuego */}
      {isMiniGameActive && (
        <div className="mini-game-container">
          <MiniJuegos onGameEnd={() => setIsMiniGameActive(false)} />
        </div>
      )}
    </div>
  );
};

export default App;

