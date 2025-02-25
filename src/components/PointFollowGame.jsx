import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Timer, Trophy, X, Target } from 'lucide-react';
import './PointFollowGame.css';

const PointGame = ({ onClose }) => {
    const [punto, setPunto] = useState({ x: 50, y: 50 });
    const [puntuacion, setPuntuacion] = useState(0);
    const [fallos, setFallos] = useState(0);
    const [jugando, setJugando] = useState(false);
    const [tiempo, setTiempo] = useState(15);
    const [ripple, setRipple] = useState(null);
    const timeoutRef = useRef();

    useEffect(() => {
        if (jugando) {
            const moverPunto = () => {
                setPunto({
                    x: Math.random() * 90 + 5,
                    y: Math.random() * 90 + 5,
                });
                const delay = Math.random() * 500 + 500;
                timeoutRef.current = setTimeout(moverPunto, delay);
            };

            moverPunto();

            const tiempoIntervalo = setInterval(() => {
                setTiempo((prev) => {
                    if (prev <= 1) {
                        clearInterval(tiempoIntervalo);
                        clearTimeout(timeoutRef.current);
                        setJugando(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(tiempoIntervalo);
                clearTimeout(timeoutRef.current);
            };
        }
    }, [jugando]);

    const manejarClick = (e) => {
        e.stopPropagation();
        if (!jugando) return;

        setPuntuacion((prev) => prev + 1);
        clearTimeout(timeoutRef.current);
        setPunto({
            x: Math.random() * 90 + 5,
            y: Math.random() * 90 + 5,
        });
        const delay = Math.random() * 500 + 500;
        timeoutRef.current = setTimeout(() => {
            setPunto({
                x: Math.random() * 90 + 5,
                y: Math.random() * 90 + 5,
            });
        }, delay);
    };

    const manejarFallo = (e) => {
        if (jugando) {
            setFallos((prev) => prev + 1);
            const rect = e.currentTarget.getBoundingClientRect();
            setRipple({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            setTimeout(() => setRipple(null), 600);
        }
    };

    const reiniciarJuego = () => {
        setTiempo(15);
        setPuntuacion(0);
        setFallos(0);
        onClose();
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
                            transition={{ type: 'spring', stiffness: 300 }}
                            key={`${punto.x}-${punto.y}`}
                        >
                            <Target size={24} color="#fff" />
                        </motion.div>

                        <div className="indicadores">
                            <div className="score-board">
                                <Trophy size={20} /> {puntuacion}
                                <span className="separador">|</span>
                                <X size={20} /> {fallos}
                            </div>
                            <div className="timer">
                                <Timer size={20} /> {tiempo}s
                            </div>
                        </div>

                        {ripple && (
                            <motion.div
                                className="ripple"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                style={{
                                    left: ripple.x,
                                    top: ripple.y,
                                }}
                            />
                        )}
                    </>
                ) : tiempo === 0 ? (
                    <motion.div
                        className="game-over"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="game-over-content">
                            <h2>¡Tiempo terminado!</h2>
                            <div className="puntuacion-final">
                                <Trophy size={32} />
                                <span>{puntuacion}</span>
                            </div>
                            <button
                                className="close-button"
                                onClick={reiniciarJuego}
                                style={{fontSize: '18px'}}
                            >
                                <X size={18} /> Cerrar Juego
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        className="start-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setJugando(true);
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} // Movimiento para centrar
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{
                            position: 'absolute',  // Esto asegura que el botón se posicione respecto al contenedor
                        }}
                    >
                        <Play size={20} /> Comenzar
                    </motion.button>

                )}
            </div>
        </div>
    );
};

export default PointGame;