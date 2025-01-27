import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaPlay, FaStop } from 'react-icons/fa';
import './D2RTest.css';

const D2RTest = ({ startTest, endTest }) => {
    const [isInstructionsVisible, setIsInstructionsVisible] = useState(true);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [lettersGrid, setLettersGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [isResultsVisible, setIsResultsVisible] = useState(false);

    const generateGrid = () => {
        const rows = 14;
        const cols = 57;
        const totalElements = rows * cols;
        const correctCount = Math.floor(totalElements / 2.22);
        const correctIndices = new Set();

        while (correctIndices.size < correctCount) {
            correctIndices.add(Math.floor(Math.random() * totalElements));
        }

        const grid = Array.from({ length: totalElements }, (_, index) => ({
            value: correctIndices.has(index) ? "D''" : Math.random() > 0.5 ? "D'" : 'D',
            isCorrect: correctIndices.has(index),
            clicked: false,
        }));

        setLettersGrid(grid);
    };

    const handleLetterClick = (index) => {
        if (!lettersGrid[index].clicked) {
            const updatedGrid = [...lettersGrid];
            updatedGrid[index].clicked = true;
            setLettersGrid(updatedGrid);

            if (updatedGrid[index].isCorrect) {
                setScore((prev) => prev + 1);
            }
        }
    };

    const handleStartTest = () => {
        generateGrid();
        setIsTestStarted(true);
    };

    const handleEndTest = () => {
        setIsTestStarted(false);
        setIsResultsVisible(true);
    };

    const getLevel = (score) => {
        if (score >= 123) return 'Alto';
        if (score >= 108) return 'Medio alto';
        if (score >= 93) return 'Medio';
        if (score >= 78) return 'Medio bajo';
        return 'Bajo';
    };

    const getInterpretations = (score) => {
        const level = getLevel(score);
        return {
            level,
            concentration: score >= 93 ? 'Buena capacidad para mantener la concentración' : 'Problemas para mantener la concentración',
            speed: score >= 93 ? 'Buena velocidad de procesamiento' : 'Procesamiento lento',
            precision: score >= 93 ? 'Persona fue precisa' : 'Gran proporción de errores',
        };
    };

    const interpretations = getInterpretations(score);

    return (
        <div className="test-container">
            {isInstructionsVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="instructions-container"
                >
                    <h2>
                        <FaInfoCircle /> Instrucciones
                    </h2>
                    <p>
                        Este test consiste en identificar las letras <strong>D''</strong> en un
                        conjunto de estímulos. Haz clic únicamente en las <strong>D''</strong> para
                        obtener puntos.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsInstructionsVisible(false)}
                    >
                        <FaPlay /> Continuar
                    </motion.button>
                </motion.div>
            )}

            {!isInstructionsVisible && !isTestStarted && !isResultsVisible && (
                <motion.div className="start-screen">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleStartTest}
                    >
                        <FaPlay /> Iniciar Test
                    </motion.button>
                </motion.div>
            )}

            {isTestStarted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="letters-grid"
                >
                    {lettersGrid.map((cell, index) => (
                        <motion.div
                            key={index}
                            className={`letter ${cell.clicked ? (cell.isCorrect ? 'correct' : 'incorrect') : ''}`}
                            onClick={() => handleLetterClick(index)}
                        >
                            {cell.value}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {isTestStarted && (
                <motion.button
                    className="end-test-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEndTest}
                >
                    <FaStop /> Finalizar Test
                </motion.button>
            )}

            {isResultsVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="results-modal"
                >
                    <h2>Resultados del Test</h2>
                    <p><strong>Nivel:</strong> {interpretations.level}</p>
                    <p><strong>Concentración:</strong> {interpretations.concentration}</p>
                    <p><strong>Velocidad de Trabajo:</strong> {interpretations.speed}</p>
                    <p><strong>Precisión:</strong> {interpretations.precision}</p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setIsResultsVisible(false);
                            endTest();
                        }}
                    >
                        Cerrar
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
};

export default D2RTest;
