import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket, FaSmile } from 'react-icons/fa';
import './PantallaBienvenida.css';

const PantallaBienvenida = ({ onFinish }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        className="welcome-screen"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.8 }}   
        transition={{ duration: 1 }}    
      >
        <motion.div
          className="icon-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <FaRocket className="welcome-icon" />
        </motion.div>
        <motion.h1
          className="welcome-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Bienvenido
        </motion.h1>
        <motion.p
          className="welcome-text"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Estamos preparando la aplicación para ti
        </motion.p>

        {/* Barra de carga */}
        <motion.div
          className="loading-bar"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2.5,
            ease: "easeInOut"
          }}
          onAnimationComplete={() => {
            onFinish();
          }}
        />

        <motion.div
          className="icon-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <FaSmile className="welcome-icon" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PantallaBienvenida;
