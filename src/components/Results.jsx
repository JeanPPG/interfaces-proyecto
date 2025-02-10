// Results.jsx
import React, { useState } from "react";
import { Camera, Eye, EyeOff, PlayCircle, BarChart2 } from "lucide-react";
import Webcam from "react-webcam";
import Dashboard from "./Dashboard"; // Importa el componente Dashboard
import "./Results.css";

const Results = ({
  setCameraEnabled,
  cameraEnabled,
  startTest,
  gamesCompleted,
  token,
  testFinished,
  toggleCameraEnabled,
}) => {
  const [showDashboard, setShowDashboard] = useState(false);

  // El botón "Iniciar Test" se activa si los minijuegos han finalizado y el test aún no se completó.
  const isIniciarTestEnabled = gamesCompleted && !testFinished;
  // El botón "Visualizar Resultados" se activa solo si el test D2R ha finalizado.
  const isVisualizarResultadosEnabled = testFinished;

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <Dashboard token={token} onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="results p-4">
      <h2 className="text-2xl font-bold mb-4">HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      {cameraEnabled ? null : (
        <p className="mb-4">
          🎮 Para acceder a los mini juegos, primero debes activar la cámara.
        </p>
      )}

      {/* Botón para visualizar resultados */}
      <button
        disabled={!isVisualizarResultadosEnabled}
        onClick={handleShowDashboard}
        className="btn flex items-center space-x-2 mb-2"
      >
        <BarChart2 className="icon" />
        <span>Visualizar Resultados</span>
      </button>

      {/* Botón para activar/desactivar la cámara */}
      <button
        disabled={!toggleCameraEnabled}
        onClick={toggleCamera}
        className="btn flex items-center space-x-2 mb-2"
      >
        {cameraEnabled ? <EyeOff className="icon" /> : <Eye className="icon" />}
        <span>{cameraEnabled ? "Desactivar Cámara" : "Activar Cámara"}</span>
      </button>

      {/* Botón para iniciar el test */}
      <button
        disabled={!isIniciarTestEnabled}
        onClick={startTest}
        className="btn flex items-center space-x-2 mb-2"
      >
        <PlayCircle className="icon" />
        <span>Iniciar Test</span>
      </button>

      {/* Cámara en vivo */}
      {cameraEnabled && (
        <div className="camera-container mt-4">
          <p className="camera-status mb-2">📷 La cámara está activada.</p>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: "user" }}
            className="camera-feed rounded shadow"
          />
        </div>
      )}
    </div>
  );
};

export default Results;
