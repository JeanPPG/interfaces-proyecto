import React, { useState } from "react";
import Webcam from "react-webcam";  // Importamos la librería

import "./Results.css";

const Results = ({ setCameraEnabled, cameraEnabled }) => {

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev); // Cambia el estado de activación de la cámara
  };

  return (
    <div className="results">
      <h2>HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      <p>🎮 Para acceder a los mini juegos, primero debes activar la cámara.</p> {/* Enunciado informativo */}
      <p>📊 Visualiza los resultados de tus actividades aquí.</p>
      <button onClick={toggleCamera}>
        {cameraEnabled ? "Desactivar Cámara" : "Activar Cámara"}
      </button>
      
      {cameraEnabled && (
        <div className="camera-container">
          <p className="camera-status">📷 La cámara está activada.</p>
          
        </div>
      )}
    </div>
  );
};

export default Results;
