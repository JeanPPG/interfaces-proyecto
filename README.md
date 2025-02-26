# 📸 **Aplicación de Evaluación de Atención con Reconocimiento Facial**  

Bienvenido a este proyecto de **evaluación del nivel de atención de estudiantes universitarios** usando tecnologías avanzadas como **Morphcast**, **GazeRecorder**. Esta aplicación analiza emociones y patrones de atención mediante la cámara, almacenando los datos para análisis posterior.  

---

## 🚀 **Características del Proyecto**  

🌐 **Frontend** desarrollado en **React.js** y **Vite** para una experiencia rápida, interactiva y responsiva.  
- 📊 **APIs integradas** para reconocimiento facial y rastreo ocular:  
  - **Morphcast** para emociones y atención.  
  - **GazeRecorder** para análisis de mirada.  
- 💾 **Backend** con **Python Flask** y **PostgreSQL** para almacenamiento y gestión de datos. 

---

## 🛠️ **Requisitos Previos**  

Asegúrate de tener instalados los siguientes componentes:  

1. **Node.js** y **npm**: [Descargar aquí](https://nodejs.org/)  
2. **Git**: [Descargar aquí](https://git-scm.com/)  
3. Un navegador web moderno como Chrome o Edge.  

---

## 🧑‍💻 **Configuración del Proyecto**  

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local:  

### 1️⃣ Clona este repositorio  
```bash
git clone https://github.com/JeanPPG/interfaces-proyecto.git
cd interfaces-proyecto
```

### 2️⃣ Instala las dependencias
```bash
npm install
```

### 3️⃣ Ejecuta la aplicación React
En otra terminal:
```bash
npm run start
```
## 🎮 **Cómo Usar la Aplicación**
Accede a http://localhost:3000 en tu navegador.
Activa la cámara y selecciona un minijuego.
Al acabar todos los test, los datos de la sesión se guardarán automáticamente en el backend.

## 📂 **Estructura del Proyecto**
```text
src/
├── App.jsx              # Lógica principal de la aplicación
├── App.css             # Estilos globales
├── components/
│   ├── MiniGames.jsx          # Minijuegos interactivos
│   ├── Results.jsx            # Visualización de resultados
│   ├── PointFollowGame.jsx    # Minijuego específico
│   ├── ReactionGame.jsx       # Minijuego específico
│   ├── FindObjectGame.jsx     # Minijuego específico
├── App.py           # Servidor backend para guardar datos
vite.config.js           # Configuración de Vite
```

## 💡 **Tecnologías Utilizadas**
Frontend: React.js, Vite
Backend: Node.js, Flask
APIs: Morphcast, GazeRecorder
Análisis de datos: Python

## 📊 **Flujo de Trabajo**
Captura de Datos: Morphcast y GazeRecorder recopilan datos de emociones y mirada.
Almacenamiento: Los datos se guardan automáticamente como archivos JSON en el servidor.
Análisis: Los datos JSON son compatibles para análisis avanzado en Python.

