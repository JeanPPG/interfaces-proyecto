import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './D2RTest.css';

const D2RTest = ({ startTest, endTest }) => {
    const [isInstructionsVisible, setIsInstructionsVisible] = useState(true);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [lettersGrid, setLettersGrid] = useState([]);
    const [score, setScore] = useState(0);

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



    return (
        <div className="test-container">
            {isInstructionsVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="instructions-container"
                >
                    <h2>Instrucciones</h2>
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
                        Continuar
                    </motion.button>
                </motion.div>
            )}

            {!isInstructionsVisible && !isTestStarted && (
                <motion.div className="start-screen">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleStartTest}
                    >
                        Iniciar Test
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

            {/* Botón para finalizar el test */}
            {isTestStarted && (
                <motion.button
                    className="end-test-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={endTest}
                >
                    Finalizar Test
                </motion.button>
            )}
        </div>
    );
};

export default D2RTest;
