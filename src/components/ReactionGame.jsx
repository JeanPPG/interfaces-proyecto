import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { XCircle, PlayCircle } from 'lucide-react'; // Íconos para mejorar el UI
import './ReactionGame.css';

const ReactionGame = ({ onClose }) => {
  // Estados del juego: "initial", "waiting", "ready", "finished" y "fail"
  const [gameState, setGameState] = useState("initial");
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  // Inicia el juego y programa un retardo aleatorio
  const startGame = () => {
    setGameState("waiting");
    const delay = Math.floor(Math.random() * 3000) + 2000; // entre 2000 y 5000 ms
    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, delay);
  };

  // Maneja el clic del usuario en cualquier parte de la pantalla
  const handleClick = () => {
    if (gameState === "waiting") {
      // Clic prematuro
      clearTimeout(timeoutRef.current);
      setGameState("fail");
    } else if (gameState === "ready") {
      // Calcula el tiempo de reacción
      const reaction = Date.now() - startTimeRef.current;
      setReactionTime(reaction);
      setGameState("finished");
    }
    // En otros estados no se procesa el clic global.
  };

  return (
    <div className="reaction-container" onClick={handleClick}>
      {gameState === "initial" && (
        <motion.button
          className="start-button"
          onClick={(e) => {
            e.stopPropagation(); // Evita la propagación para no disparar handleClick
            startGame();
          }}
        >
          <PlayCircle size={24} /> Iniciar Reacción
        </motion.button>
      )}

      {gameState === "waiting" && (
        <div className="message waiting">
          <p>¡Espera la señal!</p>
          <p className="cyber-text">Prepárate...</p>
        </div>
      )}

      {gameState === "ready" && (
        <div className="message ready">
          ¡AHORA! ¡Haz clic YA!
        </div>
      )}

      {gameState === "fail" && (
        <div className="message fail">
          <p>¡Demasiado pronto!</p>
          <p>Reacción cancelada.</p>
          <div className="result-container">
            <motion.button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose && onClose();
              }}
            >
              <XCircle size={24} /> Cerrar Juego
            </motion.button>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="message finished">
          <p>
            Tu tiempo de reacción es: <span className="reaction-time">{reactionTime} ms</span>
          </p>
          <div className="result-container">
            <motion.button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose && onClose();
              }}
            >
              <XCircle size={30} /> Cerrar Juego
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionGame;
