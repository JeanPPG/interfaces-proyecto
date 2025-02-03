import React, { useState, useEffect, useRef } from 'react';
import MiniJuegos from './components/MiniGames';
import Results from './components/Results';
import PantallaBienvenida from './components/PantallaBienvenida';
import D2RTest from './components/D2RTest';
import './App.css';

/* global GazeRecorderAPI */

const App = () => {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isMiniGameActive, setIsMiniGameActive] = useState(false);
  const [gamesCompleted, setGamesCompleted] = useState(0); // Nuevo estado para contar los juegos completados
  const [sessionData, setSessionData] = useState({});
  const [startTest, setTestActive] = useState(false);

  const saveSessionData = (data) => {
    fetch('http://localhost:5000/save_session_data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  };

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

  const [stopMorphcastFn, setStopMorphcastFn] = useState(null);
  const stopGazeRecorderFn = useRef(null);

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

  const handleStartTest = () => {
    setTestActive(true);
  };

  const handleGameEnd = () => {
    setGamesCompleted((prev) => prev + 1);
  };

  if (mostrarBienvenida) {
    return <PantallaBienvenida onFinish={() => setMostrarBienvenida(false)} />;
  }

  return (
    <div className={`app ${isMiniGameActive ? 'mini-game-active' : ''}`}>
      {!isMiniGameActive && !startTest && (
        <div className={`results ${cameraEnabled ? 'camera-active' : ''}`}>
          <Results
            setCameraEnabled={setCameraEnabled}
            cameraEnabled={cameraEnabled}
            startTest={handleStartTest}
            gamesCompleted={gamesCompleted === 3} // Envía si los minijuegos fueron completados
          />
        </div>
      )}

      {startTest && (
        <div className="mini-game-container">
          <D2RTest endTest={() => setTestActive(false)} />
        </div>
      )}

      {cameraEnabled && !isMiniGameActive && !startTest && (
        <div className="right-column">
          <MiniJuegos onGameEnd={handleGameEnd} />
        </div>
      )}
    </div>
  );
};

export default App;
