import React, { useState, useEffect } from 'react';
import MiniJuegos from './components/MiniGames';
import Results from './components/Results';
import './App.css';

/* global GazeRecorderAPI */

const App = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isMiniGameActive, setIsMiniGameActive] = useState(false);
  const [sessionData, setSessionData] = useState({}); // Para almacenar datos de la sesión

  const saveSessionData = (data) => {
    // Convierte los datos a un archivo JSON y los descarga
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_data_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Cargar Morphcast SDK
  const loadMorphcastSDK = async () => {
    try {
      const scriptLoader = (src, config = null) =>
        new Promise((resolve) => {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.onload = resolve;
          if (config) script.setAttribute('data-config', config);
          script.src = src;
          document.head.appendChild(script);
        });

      await scriptLoader("https://sdk.morphcast.com/mphtools/v1.1/mphtools.js", "compatibilityUI, compatibilityAutoCheck");
      await scriptLoader("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

      const CY = await window.CY;
      const loader = CY.loader();

      loader
        .licenseKey("sk52c05b0d7a4c86845903a5f3e556f024c07299241fd3") // Reemplaza con tu licencia real
        .addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.4 })
        .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
        .addModule(CY.modules().DATA_AGGREGATOR.name, { initialWaitMs: 2000, periodMs: 1000 });

      loader.load().then(({ start, stop }) => {
        if (cameraEnabled) start();

        // Escuchar eventos
        window.addEventListener(CY.modules().DATA_AGGREGATOR.eventName, (e) => {
          console.log("DATA_AGGREGATOR result", e.detail);
          setSessionData((prevData) => ({
            ...prevData,
            morphcast: [...(prevData.morphcast || []), e.detail],
          }));
        });

        // Desactivar Morphcast al deshabilitar la cámara
        return () => {
          stop();
          window.removeEventListener(CY.modules().DATA_AGGREGATOR.eventName, null);
        };
      });

      console.log("Morphcast SDK loaded successfully");
    } catch (error) {
      console.error("Error loading Morphcast SDK:", error);
    }
  };

  // Cargar y configurar GazeRecorder
  const loadGazeRecorder = () => {
    const script = document.createElement('script');
    script.src = "https://app.gazerecorder.com/GazeRecorderAPI.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("GazeRecorder SDK loaded");

      if (cameraEnabled) {
        GazeRecorderAPI.Rec(); // Inicia grabación
        console.log("GazeRecorder recording started");
      }

      // Limpieza cuando la cámara se deshabilita
      return () => {
        GazeRecorderAPI.StopRec(); // Detener grabación
        console.log("GazeRecorder recording stopped");

        const gazeData = GazeRecorderAPI.GetRecData(); // Guardar datos
        console.log("Session Replay Data:", gazeData);

        setSessionData((prevData) => ({
          ...prevData,
          gazeRecorder: gazeData,
        }));
      };
    };

    script.onerror = () => console.error("Failed to load GazeRecorder script");
  };

  // Activar o desactivar APIs según el estado de la cámara
  useEffect(() => {
    if (cameraEnabled) {
      loadMorphcastSDK();
      loadGazeRecorder();
    } else if (Object.keys(sessionData).length > 0) {
      // Guardar los datos al desactivar la cámara
      saveSessionData(sessionData);
    }
  }, [cameraEnabled]);

  const handleMiniGameStart = () => {
    setIsMiniGameActive(true); // Activamos el mini juego
  };

  const handleMiniGameEnd = () => {
    setIsMiniGameActive(false); // Volver a la vista principal
  };

  return (
    <div className={`app ${isMiniGameActive ? 'mini-game-active' : ''}`}>
      {!isMiniGameActive && (
        <div className="left-column">
          <Results setCameraEnabled={setCameraEnabled} cameraEnabled={cameraEnabled} />
        </div>
      )}

      {cameraEnabled && !isMiniGameActive && (
        <div className="right-column">
          <MiniJuegos onGameStart={handleMiniGameStart} />
        </div>
      )}

      {isMiniGameActive && (
        <div className="mini-game-container">
          <MiniJuegos onGameStart={handleMiniGameStart} onGameEnd={handleMiniGameEnd} />
        </div>
      )}
    </div>
  );
};

export default App;
