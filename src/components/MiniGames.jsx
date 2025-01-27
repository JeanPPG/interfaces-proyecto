import React, { useState } from "react";
import "./MiniGames.css";
import ReactionGame from "./ReactionGame"; // Importamos el juego de reacción
import PointFollowGame from "./PointFollowGame"; // Importamos el juego "Seguir el punto"
import FindObjectGame from "./FindObjectGame"; // Importamos el juego "Buscar el objeto"

const MiniGames = ({ onGameStart, onGameEnd }) => {
  const [activeGame, setActiveGame] = useState(null); // Estado para controlar el juego activo

  // Función para manejar la activación de un juego
  const toggleGame = (game) => {
    setActiveGame((prev) => (prev === game ? null : game)); // Alternar entre mostrar/ocultar el juego
  };

  return (
    <div className="mini-games">
      <h2>🎮 Mini Juegos</h2>

      {/* Botón para "Seguir el punto" */}
      <p onClick={() => toggleGame("pointFollowGame")}>➡️ Seguir el punto</p>
      {activeGame === "pointFollowGame" && (
        <div className="follow-game-container">
          <PointFollowGame />
        </div>
      )}

      {/* Botón para "Buscar el objeto" */}
      <p onClick={() => toggleGame("findObjectGame")}>🔍 Buscar el objeto</p>
      {activeGame === "findObjectGame" && (
        <div className="find-object-game-container">
          <FindObjectGame />
        </div>
      )}

      {/* Botón para "Reacción rápida" */}
      <p onClick={() => toggleGame("reactionGame")}>⚡ Reacción rápida</p>
      {activeGame === "reactionGame" && (
        <div className="reaction-game-container">
          <ReactionGame />
        </div>
      )}
    </div>
  );
};

export default MiniGames;
