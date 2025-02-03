import React, { useState, useEffect } from "react";
import { Camera, Eye, EyeOff, PlayCircle, BarChart2 } from "lucide-react";
import Webcam from "react-webcam";

import "./Results.css";

const Results = ({ setCameraEnabled, cameraEnabled, startTest, gamesCompleted }) => {
  // Estado para habilitar el botón de iniciar test y visualizar resultados
  const [resultsEnabled, setResultsEnabled] = useState(false);

  useEffect(() => {
    setResultsEnabled(cameraEnabled && gamesCompleted);
  }, [cameraEnabled, gamesCompleted]);

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev);
  };

  return (
    <div className="results">
      <h2>HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      <p style={{ display: cameraEnabled ? "none" : "block" }}>
        🎮 Para acceder a los mini juegos, primero debes activar la cámara.
      </p>

      {/* Botón para visualizar resultados */}
      <button disabled={!resultsEnabled} className="btn">
        <BarChart2 className="icon" /> Visualizar Resultados
      </button>

      {/* Botón para activar/desactivar la cámara */}
      <button onClick={toggleCamera} className="btn">
        {cameraEnabled ? <EyeOff className="icon" /> : <Eye className="icon" />}
        {cameraEnabled ? "Desactivar Cámara" : "Activar Cámara"}
      </button>

      {/* Botón para iniciar el test */}
      <button disabled={!resultsEnabled} onClick={startTest} className="btn">
        <PlayCircle className="icon" /> Iniciar Test
      </button>

      {/* Cámara en vivo */}
      {cameraEnabled && (
        <div className="camera-container">
          <p className="camera-status">📷 La cámara está activada.</p>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: "user" }}
            className="camera-feed"
          />
        </div>
      )}
    </div>
  );
};

export default Results;
