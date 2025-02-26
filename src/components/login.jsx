// Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://backend-flask-production.up.railway.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Almacena el user_id en localStorage para que App.jsx lo recupere
      localStorage.setItem("userId", data.user_id);
      onLoginSuccess(data.user_id);
    } else {
      alert('Login failed');
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.form
        onSubmit={handleLogin}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="login-form"
      >
        <motion.input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Usuario"
          required
          className="input-field"
          whileFocus={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 150 }}
        />
        <motion.input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          className="input-field"
          whileFocus={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 150 }}
        />
        <motion.button
          type="submit"
          className="login-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Iniciar Sesión
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Login;
