import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './D2RTest.css';

const D2RTest = ({ startTest, endTest }) => {
    const [score, setScore] = useState(0);
    const [letters, setLetters] = useState([]);
    const [clickedLetters, setClickedLetters] = useState([]);
    const [timer, setTimer] = useState(30); // Temporizador de 30 segundos
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [isTestFinished, setIsTestFinished] = useState(false); // Estado para saber si el test ha terminado
    const [intervalTime, setIntervalTime] = useState(1000); // Tiempo de intervalo inicial (1 segundo)

    const generateRandomLetters = () => {
        const alphabet = 'D'; // Letra a mostrar
        const letterCount = 98; // Número total de letras a generar
        let generatedLetters = [];

        for (let i = 0; i < letterCount; i++) {
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
            const hasStripes = Math.random() > 0.5; // 50% de probabilidad de tener rayas
            const stripeCount = Math.random() < 0.5 ? 1 : 2; // 50% de probabilidad de tener 1 o 2 rayas
            generatedLetters.push({
                letter: randomLetter,
                hasStripes,
                stripeCount, // Número de rayas
                clicked: false,
            });
        }
        setLetters(generatedLetters);
    };

    const handleLetterClick = (index) => {
        if (!letters[index].clicked) {
            const updatedLetters = [...letters];
            updatedLetters[index].clicked = true;
            setLetters(updatedLetters);

            // Solo sumamos al puntaje si la letra tiene exactamente 2 rayas
            if (letters[index].stripeCount === 2) {
                setScore(score + 1);
            }
        }
    };

    useEffect(() => {
        if (isTestStarted) {
            generateRandomLetters();

            // Establecer un intervalo de actualización de letras
            const interval = setInterval(() => {
                setLetters((prevLetters) => {
                    return prevLetters.map((letter) => ({
                        ...letter,
                        clicked: false, // Reiniciar el estado de "clicked" de todas las letras
                    }));
                });
            }, intervalTime);

            const timerInterval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            if (timer <= 0) {
                clearInterval(interval);
                clearInterval(timerInterval);
                setIsTestFinished(true); // Marcamos el test como terminado cuando el tiempo se agota
            }

            // Acelerar el intervalo a medida que el tiempo disminuye
            if (timer <= 10) {
                setIntervalTime(500); // 500ms si quedan 10 segundos o menos
            } else if (timer <= 20) {
                setIntervalTime(750); // 750ms si quedan entre 10 y 20 segundos
            }

            return () => {
                clearInterval(interval);
                clearInterval(timerInterval);
            };
        }
    }, [isTestStarted, timer, intervalTime]);

    const handleTestFinish = () => {
        setIsTestFinished(true);
        endTest();
    };

    return (
        <div className="test-container">
            <motion.div className="top-bar">
                {isTestStarted && !isTestFinished && (
                    <span className="timer">Tiempo restante: {timer}s</span>
                )}
                <motion.button
                    className="end-test-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleTestFinish}
                >
                    Finalizar Test
                </motion.button>
            </motion.div>

            {isTestStarted && !isTestFinished ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="letters-container"
                >
                    <div className="letters-grid">
                        {letters.map((letter, index) => (
                            <motion.div
                                key={index}
                                className={`letter ${letter.clicked ? (letter.stripeCount === 2 ? 'correct' : 'incorrect') : ''}`}
                                onClick={() => handleLetterClick(index)}
                            >
                                <span className="letter-text">{letter.letter}</span>
                                {letter.hasStripes && (
                                    <div className="stripes">
                                        {[...Array(letter.stripeCount)].map((_, i) => (
                                            <div key={i} className="stripe"></div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : isTestFinished ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="result-container"
                >
                    <h2>Test Completado</h2>
                    <p>Tu puntaje es: {score}</p>
                    <motion.button
                        className="end-test-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={endTest}
                    >
                        Finalizar Test
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div className="start-screen">
                    <motion.button
                        className="start-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsTestStarted(true)}
                    >
                        Comenzar Test
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default D2RTest;
