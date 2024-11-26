import React, { useState, useEffect, useRef } from 'react';
import MiniJuegos from './components/MiniGames';
import Results from './components/Results';
import './App.css';

/* global GazeRecorderAPI */

const App = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isMiniGameActive, setIsMiniGameActive] = useState(false);
  const [sessionData, setSessionData] = useState({});

  // Guardar los datos de sesión
  const saveSessionData = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `session_data_${new Date().toISOString()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  // Manejo de Morphcast
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

    return stop; // Devuelve la función para detener Morphcast
  };

  const stopMorphcast = (stop) => {
    if (stop) {
      stop();
      window.removeEventListener(window.CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    }
  };

  const handleMorphcastData = (e) => {
    setSessionData((prevData) => ({
      ...prevData,
      morphcast: [...(prevData.morphcast || []), e.detail],
    }));
  };

  // Manejo de GazeRecorder
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

  const [stopMorphcastFn, setStopMorphcastFn] = useState(null); // Guarda la función para detener Morphcast
  const stopGazeRecorderFn = useRef(null); // Guarda la función para detener GazeRecorder

  // Manejo del estado de la cámara
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
    </div>
  );
};

export default App;
