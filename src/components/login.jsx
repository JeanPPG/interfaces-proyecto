import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css'; // Asegúrate de importar el CSS

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password }),
        });

        const data = await response.json();

        if (data.success) {
            onLoginSuccess(data.token); // Suponiendo que el backend devuelve un token
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
