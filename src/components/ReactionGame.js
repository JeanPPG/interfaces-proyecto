import React, { useState, useEffect } from 'react';

const ColorSwitchGame = () => {
  const [color, setColor] = useState('red'); // Color inicial
  const [score, setScore] = useState(0); // Puntuación
  const [gameOver, setGameOver] = useState(false); // Estado del juego
  const [buttonEnabled, setButtonEnabled] = useState(false); // Habilitar el botón cuando el color cambie

  useEffect(() => {
    // Cambiar de color aleatoriamente cada 1-2 segundos
    const interval = setInterval(() => {
      if (!gameOver) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setColor(randomColor);
        setButtonEnabled(true); // Activar el botón para hacer clic
      }
    }, 2000); // Cambio de color cada 1 segundo

    return () => clearInterval(interval); // Limpiar intervalo cuando el componente se desmonte
  }, [gameOver]);

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
    <div style={styles.container}>
      <h2 style={styles.title}>🎨 Color Switch</h2>
      {gameOver ? (
        <div>
          <p style={styles.gameOverText}>¡Juego Terminado! Tu puntuación final fue: {score}</p>
          <button onClick={restartGame} style={styles.restartButton}>Reiniciar Juego</button>
        </div>
      ) : (
        <div style={styles.gameContainer}>
          <div
            style={{
              ...styles.circle,
              backgroundColor: color,
            }}
          />
          <p style={styles.instructions}>Haz clic en el color que aparece en el círculo.</p>
          {buttonEnabled && (
            <div style={styles.colorButtons}>
              <button onClick={() => handleClick('red')} style={styles.colorButton}>Rojo</button>
              <button onClick={() => handleClick('blue')} style={styles.colorButton}>Azul</button>
              <button onClick={() => handleClick('green')} style={styles.colorButton}>Verde</button>
              <button onClick={() => handleClick('yellow')} style={styles.colorButton}>Amarillo</button>
            </div>
          )}
          <p style={styles.score}>Puntuación: {score}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222', // Fondo oscuro
    color: '#e0e0e0',
    margin: 0,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#ff6f61',
    textAlign: 'center',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
  },
  gameOverText: {
    fontSize: '1.8rem',
    color: '#ff6f61',
    textAlign: 'center',
  },
  restartButton: {
    fontSize: '1.5rem',
    padding: '10px 20px',
    backgroundColor: '#ff6f61',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px',
    transition: 'background-color 1s ease-in-out',
  },
  instructions: {
    fontSize: '1.2rem',
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: '20px',
  },
  colorButtons: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  colorButton: {
    fontSize: '1.5rem',
    padding: '10px 20px',
    backgroundColor: '#444444',
    border: 'none',
    color: '#e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  colorButtonHover: {
    backgroundColor: '#ff6f61',
  },
  score: {
    fontSize: '1.5rem',
    color: '#e0e0e0',
    marginTop: '20px',
  },
};

export default ColorSwitchGame;
