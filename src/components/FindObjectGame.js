import React, { useState, useEffect } from 'react';
import './FindObjectGame.css';

const EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍐', '🍉', '🍓', '🥝', '🍒', '🥭', '🍍', '🥥'];
const INITIAL_TIME = 30;

const FindObject = () => {
    const [jugando, setJugando] = useState(false);
    const [nivel, setNivel] = useState(1);
    const [puntuacion, setPuntuacion] = useState(0);
    const [tiempo, setTiempo] = useState(INITIAL_TIME);
    const [objetoObjetivo, setObjetoObjetivo] = useState('');
    const [objetos, setObjetos] = useState([]);

    const generarObjetos = () => {
        const numObjetos = Math.min(nivel * 5, 20);
        const objetosDisponibles = [...EMOJIS];
        const nuevosObjetos = [];
        
        // Seleccionar objeto objetivo
        const indiceObjetivo = Math.floor(Math.random() * objetosDisponibles.length);
        const objetivo = objetosDisponibles[indiceObjetivo];
        setObjetoObjetivo(objetivo);
        objetosDisponibles.splice(indiceObjetivo, 1);

        // Añadir el objeto objetivo en una posición aleatoria
        const posicionObjetivo = Math.floor(Math.random() * numObjetos);
        
        // Llenar el array de objetos
        for (let i = 0; i < numObjetos; i++) {
            if (i === posicionObjetivo) {
                nuevosObjetos.push(objetivo);
            } else {
                const indiceAleatorio = Math.floor(Math.random() * objetosDisponibles.length);
                nuevosObjetos.push(objetosDisponibles[indiceAleatorio]);
                objetosDisponibles.splice(indiceAleatorio, 1);
            }
        }

        setObjetos(nuevosObjetos);
    };

    useEffect(() => {
        let temporizador;
        if (jugando && tiempo > 0) {
            temporizador = setInterval(() => {
                setTiempo(prev => prev - 1);
            }, 1000);
        } else if (tiempo === 0) {
            finalizarJuego();
        }
        return () => clearInterval(temporizador);
    }, [jugando, tiempo]);

    const iniciarJuego = () => {
        setJugando(true);
        setNivel(1);
        setPuntuacion(0);
        setTiempo(INITIAL_TIME);
        generarObjetos();
    };

    const finalizarJuego = () => {
        setJugando(false);
        setTiempo(0);
    };

    const manejarClick = (objeto) => {
        if (objeto === objetoObjetivo) {
            setPuntuacion(prev => prev + nivel * 10);
            setNivel(prev => prev + 1);
            generarObjetos();
        } else {
            setPuntuacion(prev => Math.max(0, prev - 5));
        }
    };

    return (
        <div className="game-container">
            <div className="game-board">
                {jugando ? (
                    <>
                        <div className="score-panel">
                            <div>Puntuación: {puntuacion}</div>
                            <div>Encuentra: <span className="target-object">{objetoObjetivo}</span></div>
                            <div>Tiempo: {tiempo}s</div>
                        </div>
                        <div className="objects-container">
                            {objetos.map((objeto, index) => (
                                <div
                                    key={index}
                                    className="object"
                                    onClick={() => manejarClick(objeto)}
                                >
                                    {objeto}
                                </div>
                            ))}
                        </div>
                        <div className="level-indicator">Nivel {nivel}</div>
                    </>
                ) : tiempo === 0 ? (
                    <div className="game-over">
                        <div>¡Juego Terminado!</div>
                        <div>Puntuación Final: {puntuacion}</div>
                        <button className="start-button" onClick={iniciarJuego}>
                            Jugar de Nuevo
                        </button>
                    </div>
                ) : (
                    <button className="start-button" onClick={iniciarJuego}>
                        Iniciar Juego
                    </button>
                )}
            </div>
        </div>
    );
};

export default FindObject;