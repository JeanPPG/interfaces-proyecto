// Results.jsx
import React, { useState, useEffect } from "react";
import { Camera, Eye, EyeOff, PlayCircle, BarChart2 } from "lucide-react";
import Webcam from "react-webcam";
import Dashboard from "./Dashboard"; // Importa el componente Dashboard
import "./Results.css";

const Results = ({ setCameraEnabled, cameraEnabled, startTest, gamesCompleted, token }) => {
  // Estado para habilitar el botón de iniciar test y visualizar resultados
  const [resultsEnabled, setResultsEnabled] = useState(false);
  // Estado para mostrar el dashboard
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Cuando se termine el test, se desactiva la cámara y se habilita el botón de resultados
    if (gamesCompleted) {
      setCameraEnabled(false);
      setResultsEnabled(true);
    } else {
      setResultsEnabled(cameraEnabled && gamesCompleted);
    }
  }, [cameraEnabled, gamesCompleted, setCameraEnabled]);

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  // Si se debe mostrar el dashboard, se renderiza el componente Dashboard
  if (showDashboard) {
    return <Dashboard token={token} onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="results p-4">
      <h2 className="text-2xl font-bold mb-4">HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      {cameraEnabled ? null : (
        <p className="mb-4">🎮 Para acceder a los mini juegos, primero debes activar la cámara.</p>
      )}

      {/* Botón para visualizar resultados */}
      <button
        disabled={!resultsEnabled}
        onClick={handleShowDashboard}
        className="btn flex items-center space-x-2 mb-2"
      >
        <BarChart2 className="icon" /> 
        <span>Visualizar Resultados</span>
      </button>

      {/* Botón para activar/desactivar la cámara */}
      <button onClick={toggleCamera} className="btn flex items-center space-x-2 mb-2">
        {cameraEnabled ? <EyeOff className="icon" /> : <Eye className="icon" />}
        <span>{cameraEnabled ? "Desactivar Cámara" : "Activar Cámara"}</span>
      </button>

      {/* Botón para iniciar el test */}
      <button
        disabled={!resultsEnabled}
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
