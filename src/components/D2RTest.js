import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './D2RTest.css';

const D2RTest = ({ startTest, endTest }) => {
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const questions = [
        {
            question: "¿Cuánto es 2 + 2?",
            options: ["3", "4", "5", "6"],
            answer: "4"
        },
        {
            question: "¿Cuál es la capital de Francia?",
            options: ["Berlín", "Madrid", "París", "Lisboa"],
            answer: "París"
        },
        {
            question: "¿Cuál es el océano más grande?",
            options: ["Atlántico", "Índico", "Ártico", "Pacífico"],
            answer: "Pacífico"
        },
        {
            question: "¿Quién escribió 'Cien años de soledad'?",
            options: ["Gabriel García Márquez", "Mario Vargas Llosa", "Julio Cortázar", "Jorge Luis Borges"],
            answer: "Gabriel García Márquez"
        }
    ];

    const handleAnswer = (option) => {
        if (option === questions[questionIndex].answer) {
            setScore(score + 1);
        }
        setQuestionIndex(questionIndex + 1);
    };

    return (
        <div className="test-container">
            <motion.div className="top-bar">
                <span className="question-number">Pregunta {questionIndex + 1}</span>
                {questionIndex < questions.length && (
                    <motion.button
                        className="end-test-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={endTest}
                    >
                        Finalizar Test
                    </motion.button>
                )}
            </motion.div>
            {questionIndex < questions.length ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={questionIndex}
                    className="question-container"
                >
                    <h2 className="question-text">{questions[questionIndex].question}</h2>
                    <div className="options-container">
                        {questions[questionIndex].options.map((option, index) => (
                            <motion.button
                                key={index}
                                className="option-button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAnswer(option)}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            ) : (
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
            )}
        </div>
    );
};

export default D2RTest;
