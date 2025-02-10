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
  const [gamesCompleted, setGamesCompleted] = useState(0); // Contador de minijuegos completados
  const [sessionData, setSessionData] = useState({});
  const [startTest, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [toggleCameraEnabled, setToggleCameraEnabled] = useState(true);
  const [userId, setUserId] = useState(null);

  // Recupera el userId desde localStorage (o de otro mecanismo de persistencia) al iniciar la app
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const saveSessionData = (data) => {
    if (!userId) {
      console.error("No se encontró userId, no se pueden guardar los datos de sesión");
      return;
    }
    const sessionTimestamp = new Date().toISOString();
    const payload = {
      user_id: userId, // Se envía el id del usuario
      timestamp: sessionTimestamp,
      ...data,
    };

    fetch("http://localhost:5000/save_session_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok)
          return response.text().then((text) => {
            throw new Error("Error en la respuesta del servidor: " + text);
          });
        return response.json();
      })
      .then((data) => console.log("Datos guardados:", data))
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

    await scriptLoader(
      "https://sdk.morphcast.com/mphtools/v1.1/mphtools.js",
      "compatibilityUI, compatibilityAutoCheck"
    );
    await scriptLoader("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

    const CY = window.CY;
    const loader = CY.loader();

    loader
      .licenseKey("sk52c05b0d7a4c86845903a5f3e556f024c07299241fd3")
      .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
      .addModule(CY.modules().DATA_AGGREGATOR.name, {
        initialWaitMs: 2000,
        periodMs: 1000,
      });

    const { start, stop } = await loader.load();
    start();
    window.addEventListener(
      CY.modules().DATA_AGGREGATOR.eventName,
      handleMorphcastData
    );

    return stop;
  };

  const stopMorphcast = (stop) => {
    if (stop) {
      stop();
      window.removeEventListener(
        window.CY.modules().DATA_AGGREGATOR.eventName,
        handleMorphcastData
      );
    }
  };

  const handleMorphcastData = (e) => {
    setSessionData((prevData) => ({
      ...prevData,
      morphcast: [...(prevData.morphcast || []), e.detail],
    }));
  };

  const startGazeRecorder = () => {
    const script = document.createElement("script");
    script.src = "https://app.gazerecorder.com/GazeRecorderAPI.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      GazeRecorderAPI.Rec();
    };

    script.onerror = () =>
      console.error("Error al cargar el script de GazeRecorder");

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

  // Efecto único para manejar la activación/desactivación de la cámara y guardar la sesión
  useEffect(() => {
    if (cameraEnabled) {
      startMorphcast().then((stop) => setStopMorphcastFn(() => stop));
      stopGazeRecorderFn.current = startGazeRecorder();
    } else {
      if (stopMorphcastFn) stopMorphcast(stopMorphcastFn);
      if (stopGazeRecorderFn.current) stopGazeRecorderFn.current();
      if (Object.keys(sessionData).length > 0) {
        saveSessionData(sessionData);
        setSessionData({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraEnabled]);

  // Activa el test (el botón "Iniciar Test" se habilita cuando los minijuegos se completaron)
  const handleStartTest = () => {
    setTestActive(true);
  };

  // Callback que se invoca al finalizar el test D2R (se llama desde D2RTest.jsx)
  const handleTestEnd = () => {
    setTestActive(false);
    setTestFinished(true);
    setCameraEnabled(false); // Apaga la cámara
    setToggleCameraEnabled(false); // Deshabilita la posibilidad de volver a activar la cámara
  };

  // Cada vez que finaliza un minijuego se incrementa el contador
  const handleGameEnd = () => {
    setGamesCompleted((prev) => prev + 1);
  };

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
            gamesCompleted={gamesCompleted === 3} // Se envía true si se completaron los 3 minijuegos
            token={null} // Si se requiere, se puede pasar el token aquí
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
