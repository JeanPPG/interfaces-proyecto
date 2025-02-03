import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircle, PlayCircle } from 'lucide-react'; // Importa íconos de lucide-icons
import './FindObjectGame.css';

const EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍐', '🍉', '🍓', '🥝', '🍒', '🥭', '🍍', '🥥'];
const INITIAL_TIME = 30;

const FindObject = ({ onClose }) => {
    const [playing, setPlaying] = useState(false);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(INITIAL_TIME);
    const [targetObject, setTargetObject] = useState('');
    const [objects, setObjects] = useState([]);

    // Genera la lista de objetos, garantizando que el objetivo aparezca solo una vez
    const generateObjects = () => {
        const numObjects = Math.min(level * 5, 20);
        // Selecciona el objeto objetivo aleatoriamente
        const target = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        setTargetObject(target);

        const newObjects = [];
        // Rellenar con emojis que NO sean el objetivo
        for (let i = 0; i < numObjects - 1; i++) {
            let randomEmoji;
            do {
                randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
            } while (randomEmoji === target);
            newObjects.push(randomEmoji);
        }
        // Insertar el objeto objetivo en una posición aleatoria
        const insertIndex = Math.floor(Math.random() * numObjects);
        newObjects.splice(insertIndex, 0, target);
        setObjects(newObjects);
    };

    // Temporizador: decrementa el tiempo cada segundo
    useEffect(() => {
        let timerInterval;
        if (playing && time > 0) {
            timerInterval = setInterval(() => {
                setTime(prev => prev - 1);
            }, 1000);
        } else if (time === 0) {
            endGame();
        }
        return () => clearInterval(timerInterval);
    }, [playing, time]);

    const startGame = () => {
        setPlaying(true);
        setLevel(1);
        setScore(0);
        setTime(INITIAL_TIME);
        generateObjects();
    };

    const endGame = () => {
        setPlaying(false);
    };

    // Maneja el clic sobre un objeto
    const handleClick = (object) => {
        if (!playing) return;
        if (object === targetObject) {
            setScore(prev => prev + level * 10);
            setLevel(prev => prev + 1);
            generateObjects();
        } else {
            setScore(prev => Math.max(0, prev - 5));
        }
    };

    return (
        <div className="game-container">
            <div className="game-board">
                {playing ? (
                    <>
                        <div className="score-panel">
                            <div>Puntuación: {score}</div>
                            <div>
                                Encuentra: <span className="target-object">{targetObject}</span>
                            </div>
                            <div>Tiempo: {time}s</div>
                        </div>
                        <div className="objects-container">
                            {objects.map((object, index) => (
                                <motion.div
                                    key={index}
                                    className="object"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleClick(object)}
                                >
                                    {object}
                                </motion.div>
                            ))}
                        </div>
                        <div className="level-indicator">Nivel {level}</div>
                    </>
                ) : time === 0 ? (
                    <motion.div
                        className="game-over"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div>Puntuación Final: {score}</div>
                        <button
                            className="close-button"
                            onClick={() => { onClose && onClose(); }}
                        >
                            <XCircle size={24} /> Cerrar Juego
                        </button>
                    </motion.div>
                ) : (
                    <button className="start-button" onClick={startGame}>
                        <PlayCircle size={24} /> Iniciar Juego
                    </button>
                )}
            </div>
        </div>
    );
};

export default FindObject;
