# 📸 **Aplicación de Evaluación de Atención con Reconocimiento Facial**  

Bienvenido a este proyecto de **evaluación del nivel de atención de estudiantes universitarios** usando tecnologías avanzadas como **Morphcast**, **GazeRecorder**. Esta aplicación analiza emociones y patrones de atención mediante la cámara, almacenando los datos para análisis posterior.  

---

## 🚀 **Características del Proyecto**  

- 🌐 **Frontend** desarrollado en **React.js** para una experiencia interactiva y responsiva.  
- 📊 **APIs integradas** para reconocimiento facial y rastreo ocular:  
  - **Morphcast** para emociones y atención.  
  - **GazeRecorder** para análisis de mirada.  
- 💾 **Backend** con **Node.js** y **Flash** para almacenar datos de sesión.  

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
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2️⃣ Instala las dependencias
```bash
npm install
```

### 3️⃣ Ejecuta la aplicación React
En otra terminal:
```bash
npm start
```
## 🎮 **Cómo Usar la Aplicación**
Accede a http://localhost:3000 en tu navegador.
Activa la cámara y selecciona un minijuego.
Al desactivar la cámara, los datos de la sesión se guardarán automáticamente en el backend como un archivo JSON.

## 📂 **Estructura del Proyecto**
```text
src/
├── App.js              # Lógica principal de la aplicación
├── App.css             # Estilos globales
├── components/
│   ├── MiniGames.js          # Minijuegos interactivos
│   ├── Results.js            # Visualización de resultados
│   ├── PointFollowGame.js    # Minijuego específico
│   ├── ReactionGame.js       # Minijuego específico
│   ├── FindObjectGame.js     # Minijuego específico
├── App.py           # Servidor backend para guardar datos
```

## 💡 **Tecnologías Utilizadas**
Frontend: React.js
Backend: Node.js
APIs: Morphcast, GazeRecorder
Análisis de datos: Python

## 📊 **Flujo de Trabajo**
Captura de Datos: Morphcast y GazeRecorder recopilan datos de emociones y mirada.
Almacenamiento: Los datos se guardan automáticamente como archivos JSON en el servidor.
Análisis: Los datos JSON son compatibles para análisis avanzado en Python.

## 🧪 **Pruebas y Depuración**
Verifica que el servidor esté activo en http://localhost:5000.
Asegúrate de que la cámara esté habilitada en tu navegador.
Revisa los archivos JSON generados para confirmar que los datos se guardan correctamente.
