import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import './index.css';
import App from './App';
import Login from './components/login';
import Register from './components/Register';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    // Eliminar el token del localStorage cuando la página se recarga
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const handleLoginSuccess = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="main-container">
      {/* Condicionalmente mostrar el título solo si no está autenticado */}
        {!isAuthenticated && (
        <motion.h1
          className="app-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          HikariShiftX
        </motion.h1>
      )}

      {/* Si está autenticado, muestra el componente App */}
      {isAuthenticated ? (
        <App onLogout={handleLogout} />
      ) : (
        // Si no está autenticado, muestra los formularios de Login y Register
        <div className="auth-container">
          <motion.div
            className="auth-form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="left-form">
              <motion.h2
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                  >
                Iniciar sesión
              </motion.h2>
                    <Login onLoginSuccess={handleLoginSuccess} />
            </div>
            <div className="right-form">
              <motion.h2
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                  >
                ¿No tienes cuenta? Regístrate
              </motion.h2>
                    <Register onRegisterSuccess={handleRegisterSuccess} />
            </div>
                  </motion.div>
        </div>
        )}
    </div>
  );
};

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

reportWebVitals();
