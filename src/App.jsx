// App.jsx
import React, { useState, useEffect, useRef } from "react";
import MiniJuegos from "./components/MiniGames";
import Results from "./components/Results";
import PantallaBienvenida from "./components/PantallaBienvenida";
import D2RTest from "./components/D2RTest";
import "./App.css";

/* global GazeRecorderAPI */

const App = () => {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isMiniGameActive, setIsMiniGameActive] = useState(false);
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const [sessionData, setSessionData] = useState({ morphcast: [], gazeRecorder: [] });
  const [startTest, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [toggleCameraEnabled, setToggleCameraEnabled] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  // Función para descargar el JSON
  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `session_data_${new Date().toISOString()}.json`;
    link.click();
  };

  const saveSessionData = () => {
    if (!userId) {
      console.error("No se encontró userId, no se pueden guardar los datos de sesión");
      return;
    }
    if (!sessionData.morphcast.length && !sessionData.gazeRecorder.length) return;

    const payload = {
      user_id: userId,
      timestamp: new Date().toISOString(),
      session_data: sessionData,
    };

    // Llamada al backend
    fetch("http://localhost:5000/save_session_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos guardados:", data);
        // Generar y descargar el archivo JSON
        //downloadJSON(payload);
      })
      .catch((error) => console.error("Error:", error));
  };

  const startMorphcast = async () => {
    const scriptLoader = (src, config = null) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = resolve;
        if (config) script.setAttribute("data-config", config);
        script.src = src;
        document.head.appendChild(script);
      });

    await scriptLoader("https://sdk.morphcast.com/mphtools/v1.1/mphtools.js", "compatibilityUI, compatibilityAutoCheck");
    await scriptLoader("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

    const CY = window.CY;
    const loader = CY.loader();

    loader
      .licenseKey("sk9745abaac13f90436a06d81654e629794eb31e503851")
      .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
      .addModule(CY.modules().DATA_AGGREGATOR.name, { initialWaitMs: 2000, periodMs: 1000 });

    const { start, stop } = await loader.load();
    start();

    const handleMorphcastData = (e) => {
      setSessionData((prevData) => ({
        ...prevData,
        morphcast: [...prevData.morphcast, { timestamp: new Date().toISOString(), data: e.detail }],
      }));
    };

    window.addEventListener(CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    
    return () => {
      stop();
      window.removeEventListener(CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    };
  };

  const startGazeRecorder = () => {
    const script = document.createElement("script");
    script.src = "https://app.gazerecorder.com/GazeRecorderAPI.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      GazeRecorderAPI.Rec();
    };

    script.onerror = () => console.error("Error al cargar GazeRecorder");

    return () => {
      GazeRecorderAPI.StopRec();
      const gazeData = GazeRecorderAPI.GetRecData();
      setSessionData((prevData) => ({
        ...prevData,
        gazeRecorder: [...prevData.gazeRecorder, { timestamp: new Date().toISOString(), data: gazeData }],
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
      if (stopMorphcastFn) stopMorphcastFn();
      if (stopGazeRecorderFn.current) stopGazeRecorderFn.current();
      saveSessionData();
      setSessionData({ morphcast: [], gazeRecorder: [] });
    }
  }, [cameraEnabled]);

  const handleStartTest = () => setTestActive(true);

  const handleTestEnd = () => {
    setTestActive(false);
    setTestFinished(true);
    setCameraEnabled(false);
    setToggleCameraEnabled(false);
  };

  const handleGameEnd = () => setGamesCompleted((prev) => prev + 1);

  if (mostrarBienvenida) {
    return <PantallaBienvenida onFinish={() => setMostrarBienvenida(false)} />;
  }

  return (
    <div className={`app ${isMiniGameActive ? "mini-game-active" : ""}`}>
      {!isMiniGameActive && !startTest && (
        <div className={`results ${cameraEnabled ? "camera-active" : ""}`}>
          <Results
            setCameraEnabled={setCameraEnabled}
            cameraEnabled={cameraEnabled}
            startTest={handleStartTest}
            gamesCompleted={gamesCompleted === 3}
            token={null}
            testFinished={testFinished}
            toggleCameraEnabled={toggleCameraEnabled}
          />
        </div>
      )}

      {startTest && (
        <div className="mini-game-container">
          <D2RTest endTest={handleTestEnd} />
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
