import React, { useState, useEffect } from "react";
import "./MiniGames.css";
import ReactionGame from "./ReactionGame"; // Importamos el juego de reacción
import PointFollowGame from "./PointFollowGame"; // Importamos el juego "Seguir el punto"
import FindObjectGame from "./FindObjectGame"; // Importamos el juego "Buscar el objeto"

const MiniGames = ({ onGameStart, onGameEnd, onAllGamesComplete }) => {
  const [activeGame, setActiveGame] = useState(null); // Estado para controlar el juego activo
  const [disabledGames, setDisabledGames] = useState([]); // Estado para controlar los juegos deshabilitados

  // Efecto que verifica si ya se han completado los 3 minijuegos
  useEffect(() => {
    if (disabledGames.length === 3) {
      onAllGamesComplete && onAllGamesComplete(); // Notifica al componente padre cuando todos los juegos están completados
    }
  }, [disabledGames, onAllGamesComplete]);

  // Función para manejar la activación de un juego
  const toggleGame = (game) => {
    if (disabledGames.includes(game)) return; // Si el juego está deshabilitado, no hacer nada
    setActiveGame((prev) => (prev === game ? null : game)); // Alternar entre mostrar/ocultar el juego
    onGameStart && onGameStart(); // Notificar que un juego ha sido iniciado
  };

  // Función para cerrar un juego y deshabilitarlo
  const closeGame = (game) => {
    setActiveGame(null); // Cerrar el juego
    setDisabledGames((prev) => [...prev, game]); // Añadir el juego a la lista de deshabilitados
    onGameEnd && onGameEnd(); // Notificar que un juego ha terminado
  };

  return (
    <div className="mini-games">
      <h2>🎮 Mini Juegos</h2>

      {/* Botón para "Seguir el punto" */}
      <p
        onClick={() => toggleGame("pointFollowGame")}
        className={disabledGames.includes("pointFollowGame") ? "disabled" : ""}
      >
        {disabledGames.includes("pointFollowGame") ? "❌ Seguir el punto" : "➡️ Seguir el punto"}
      </p>
      {activeGame === "pointFollowGame" && (
        <div className="follow-game-container">
          <PointFollowGame onClose={() => closeGame("pointFollowGame")} />
        </div>
      )}

      {/* Botón para "Buscar el objeto" */}
      <p
        onClick={() => toggleGame("findObjectGame")}
        className={disabledGames.includes("findObjectGame") ? "disabled" : ""}
      >
        {disabledGames.includes("findObjectGame") ? "❌ Buscar el objeto" : "🔍 Buscar el objeto"}
      </p>
      {activeGame === "findObjectGame" && (
        <div className="find-object-game-container">
          <FindObjectGame onClose={() => closeGame("findObjectGame")} />
        </div>
      )}

      {/* Botón para "Reacción rápida" */}
      <p
        onClick={() => toggleGame("reactionGame")}
        className={disabledGames.includes("reactionGame") ? "disabled" : ""}
      >
        {disabledGames.includes("reactionGame") ? "❌ Reacción rápida" : "⚡ Reacción rápida"}
      </p>
      {activeGame === "reactionGame" && (
        <div className="reaction-game-container">
          <ReactionGame onClose={() => closeGame("reactionGame")} />
        </div>
      )}
    </div>
  );
};

export default MiniGames;
