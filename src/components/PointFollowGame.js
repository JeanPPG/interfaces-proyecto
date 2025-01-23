import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PointFollowGame.css';

const PointGame = () => {
    const [punto, setPunto] = useState({ x: 50, y: 50 });
    const [puntuacion, setPuntuacion] = useState(0);
    const [fallos, setFallos] = useState(0);
    const [jugando, setJugando] = useState(false);
    const [tiempo, setTiempo] = useState(15);

    useEffect(() => {
        let intervalo;
        if (jugando) {
            intervalo = setInterval(() => {
                setPunto({
                    x: Math.random() * 90 + 5,
                    y: Math.random() * 90 + 5,
                });
            }, 1000);

            const tiempoIntervalo = setInterval(() => {
                setTiempo((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalo);
                        clearInterval(tiempoIntervalo);
                        setJugando(false);
                        alert(`¡Fin del Juego! Tu puntuación es ${puntuacion}`);
                        return 15; // Reinicia el tiempo
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(intervalo);
                clearInterval(tiempoIntervalo);
            };
        }
    }, [jugando, puntuacion]);

    const manejarClick = (e) => {
        e.stopPropagation();
        setPuntuacion((prev) => prev + 1);
        setTiempo((prev) => prev + 2); // Aumenta el tiempo al acertar
    };

    const manejarFallo = () => {
        if (jugando) {
            setFallos((prev) => prev + 1);
            setTiempo((prev) => (prev > 2 ? prev - 2 : 0)); // Reduce el tiempo al fallar
        }
    };

    const iniciarJuego = (e) => {
        e.stopPropagation();
        setJugando(true);
        setPuntuacion(0);
        setFallos(0);
        setTiempo(15);
    };

    return (
        <div id="game-container">
            <div id="game-board" onClick={manejarFallo}>
                {jugando ? (
                    <>
                        <motion.div
                            className="point"
                            style={{
                                top: `${punto.y}%`,
                                left: `${punto.x}%`,
                            }}
                            onClick={manejarClick}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="score-board">
                            Puntuación: {puntuacion}
                            <br />
                            Fallos: {fallos}
                        </div>
                        <div className="timer">Tiempo: {tiempo}s</div>
                    </>
                ) : (
                    <motion.button
                        className="start-button"
                        onClick={iniciarJuego}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Iniciar Juego
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default PointGame;
