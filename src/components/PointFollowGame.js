import React, { useState, useEffect } from 'react';
import './PointFollowGame.css';

const PointGame = () => {
    const [punto, setPunto] = useState({ x: 50, y: 50 });
    const [puntuacion, setPuntuacion] = useState(0);
    const [fallos, setFallos] = useState(0);
    const [jugando, setJugando] = useState(false);

    useEffect(() => {
        if (jugando) {
            const intervalo = setInterval(() => {
                setPunto({
                    x: Math.random() * 90 + 5,
                    y: Math.random() * 90 + 5,
                });
            }, 1000);

            return () => clearInterval(intervalo);
        }
    }, [jugando]);

    const manejarClick = (e) => {
        e.stopPropagation();
        setPuntuacion(puntuacion + 1);
    };

    const manejarFallo = () => {
        if (jugando) {
            setFallos(fallos + 1);
            if (fallos + 1 >= 5) {
                setJugando(false);
                alert(`¡Fin del Juego! Tu puntuación es ${puntuacion}`);
                setPuntuacion(0);
                setFallos(0);
            }
        }
    };

    const iniciarJuego = (e) => {
        e.stopPropagation();
        setJugando(true);
        setPuntuacion(0);
        setFallos(0);
    };

    return (
        <div id="game-container">
            <div id="game-board" onClick={manejarFallo}>
                {jugando ? (
                    <>
                        <div
                            className="point"
                            style={{
                                top: `${punto.y}%`,
                                left: `${punto.x}%`
                            }}
                            onClick={manejarClick}
                        />
                        <div className="score-board">
                            Puntuación: {puntuacion}
                            <br />
                            Fallos: {fallos}
                        </div>
                    </>
                ) : (
                    <button 
                        className="start-button"
                        onClick={iniciarJuego}
                    >
                        Iniciar Juego
                    </button>
                )}
            </div>
        </div>
    );
};

export default PointGame;