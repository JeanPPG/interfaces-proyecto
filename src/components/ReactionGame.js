import React, { useState, useEffect } from 'react';
import './ReactionGame.css';

const ColorSwitchGame = () => {
  const [color, setColor] = useState('red'); // Color inicial
  const [score, setScore] = useState(0); // Puntuación
  const [gameOver, setGameOver] = useState(false); // Estado del juego
  const [buttonEnabled, setButtonEnabled] = useState(false); // Habilitar el botón cuando el color cambie

  useEffect(() => {
    // Calcular el intervalo en función de la puntuación
    const intervalTime = Math.max(500, 2000 - score * 100); // Reducir el tiempo hasta un mínimo de 500ms

    const interval = setInterval(() => {
      if (!gameOver) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setColor(randomColor);
        setButtonEnabled(true); // Activar el botón para hacer clic
      }
    }, intervalTime); // Cambio de color según el intervalo calculado

    return () => clearInterval(interval); // Limpiar intervalo cuando el componente se desmonte
  }, [gameOver, score]);

  const handleClick = (clickedColor) => {
    if (clickedColor === color) {
      setScore(score + 1); // Aumentar la puntuación si el color coincide
      setButtonEnabled(false); // Desactivar el botón hasta el siguiente cambio de color
    } else {
      setGameOver(true); // Terminar el juego si el color no coincide
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setButtonEnabled(false);
  };

  return (
    <div className="container">
      <h2 className="title">🎨 Color Switch</h2>
      {gameOver ? (
        <div>
          <p className="gameOverText">¡Juego Terminado! Tu puntuación final fue: {score}</p>
          <button onClick={restartGame} className="restartButton">Reiniciar Juego</button>
        </div>
      ) : (
        <div className="gameContainer">
          <div
            className="circle"
            style={{ backgroundColor: color }}
          />
          <p className="instructions">Haz clic en el color que aparece en el círculo.</p>
          {buttonEnabled && (
            <div className="colorButtons">
              <button onClick={() => handleClick('red')} className="colorButton">Rojo</button>
              <button onClick={() => handleClick('blue')} className="colorButton">Azul</button>
              <button onClick={() => handleClick('green')} className="colorButton">Verde</button>
              <button onClick={() => handleClick('yellow')} className="colorButton">Amarillo</button>
            </div>
          )}
          <p className="score">Puntuación: {score}</p>
        </div>
      )}
    </div>
  );
};



export default ColorSwitchGame;
