import React, { useState } from "react";
import "./MiniGames.css";
import ReactionGame from "./ReactionGame"; // Importamos el juego de reacción
import PointFollowGame from "./PointFollowGame"; // Importamos el juego "Seguir el punto"
import FindObjectGame from "./FindObjectGame"; // Importamos el juego "Buscar el objeto"
import FindObject from "./FindObjectGame";

const MiniGames = ({ onGameStart, onGameEnd }) => {
  const [showReactionGame, setShowReactionGame] = useState(false); // Estado para mostrar/ocultar el juego de reacción
  const [showPointFollowGame, setShowPointFollowGame] = useState(false); // Estado para el juego "Seguir el punto"
  const [showFindObjectGame, setShowFindObjectGame] = useState(false); // Estado para el juego "Buscar el objeto"

  // Función que maneja la visibilidad de cada juego
  const toggleReactionGame = () => {
    setShowReactionGame((prev) => !prev); // Alternar visibilidad del juego de reacción
  };

  const togglePointFollowGame = () => {
    setShowPointFollowGame((prev) => !prev); // Alternar visibilidad del juego "Seguir el punto"
  };

  const toggleFindObjectGame = () => {
    setShowFindObjectGame((prev) => !prev); // Alternar visibilidad del juego "Buscar el objeto"
  };

  return (
    <div className="mini-games">
      <h2>🎮 Mini Juegos</h2>
      
      {/* Botón para "Seguir el punto" */}
      <p onClick={togglePointFollowGame}>➡️ Seguir el punto</p>
      {showPointFollowGame && (
        <div className="follow-game-container">
        <PointFollowGame />
      </div>
      )}
      
      {/* Botón para "Buscar el objeto" */}
      <p onClick={toggleFindObjectGame}>🔍 Buscar el objeto</p>
      {showFindObjectGame && (
        <div className="find-object-game-container">
          <FindObjectGame />
        </div>
      )}

      {/* Botón para "Reacción rápida" */}
      <p onClick={toggleReactionGame}>⚡ Reacción rápida</p>
      {showReactionGame && (
        <div className="reaction-game-container">
          <ReactionGame />
        </div>
      )}
    </div>
  );
};

export default MiniGames;
