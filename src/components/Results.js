import React, { useState } from "react";
import Webcam from "react-webcam";  // Importamos la librería

import "./Results.css";

const Results = ({ setCameraEnabled, cameraEnabled, startTest }) => {
  const [resultsEnabled, setResultsEnabled] = useState(false);
  const [timer, setTimer] = useState(null);

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev);
    if (!cameraEnabled) {
      const newTimer = setTimeout(() => {
        setResultsEnabled(true);
      }, 10000); // 10 segundos
      setTimer(newTimer);
    } else {
      clearTimeout(timer);
      setResultsEnabled(false);
    }
  };

  return (
    <div className="results">
      <h2>HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      <p>🎮 Para acceder a los mini juegos, primero debes activar la cámara.</p> {/* Enunciado informativo */}
      <button disabled={!resultsEnabled}>
        Visualizar Resultados
      </button>
      <button onClick={toggleCamera}>
        {cameraEnabled ? "Desactivar Cámara" : "Activar Cámara"}
      </button>
      <button onClick={startTest}>
        Iniciar Test
      </button>
      
      {cameraEnabled && (
        <div className="camera-container">
          <p className="camera-status">📷 La cámara está activada.</p>
          <Webcam
            audio={false} // Desactivar audio
            screenshotFormat="image/jpeg" // Formato de captura
            width="100%" // 100% de ancho de su contenedor
            videoConstraints={{
              facingMode: "user", // Modo de la cámara frontal
            }}
            className="camera-feed" // Aplicar clase CSS para darle estilo
          />
        </div>
      )}
    </div>
  );
};


export default Results;
