import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Register.css'; // Asegúrate de importar el CSS

const Register = ({ onRegisterSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password }),
        });

        const data = await response.json();

        if (data.success) {
            onRegisterSuccess();
        } else {
            alert('Registration failed');
        }
    };

    return (
        <motion.div
            className="register-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.form
                onSubmit={handleRegister}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="register-form"
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
                    className="register-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    Registrarse
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default Register;
