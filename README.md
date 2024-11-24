# 📸 **Aplicación de Evaluación de Atención con Reconocimiento Facial**  

Bienvenido a este proyecto de **evaluación del nivel de atención de estudiantes universitarios** usando tecnologías avanzadas como **Morphcast**, **GazeRecorder**, y **OpenCV**. Esta aplicación analiza emociones y patrones de atención mediante la cámara, almacenando los datos para análisis posterior.  

---

## 🚀 **Características del Proyecto**  

- 🌐 **Frontend** desarrollado en **React.js** para una experiencia interactiva y responsiva.  
- 📊 **APIs integradas** para reconocimiento facial y rastreo ocular:  
  - **Morphcast** para emociones y atención.  
  - **GazeRecorder** para análisis de mirada.  
- 💾 **Backend** con **Node.js** y **Express** para almacenar datos de sesión.  
- 🔍 Datos listos para análisis con **OpenCV** y el modelo Haar Cascade en Python.  

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

### 2️⃣ Instala las dependencias
```bash
npm install
### 3️⃣ Configura el backend
En la raíz del proyecto, crea el archivo server.js y asegúrate de que contenga el backend descrito.

Instala dependencias adicionales:
```bash
npm install express body-parser cors

Inicia el servidor:
```bash
node server.js

### 4️⃣ Ejecuta la aplicación React
En otra terminal:
```bash
npm start

## 🎮 **Cómo Usar la Aplicación**
Accede a http://localhost:3000 en tu navegador.
Activa la cámara y selecciona un minijuego.
Al desactivar la cámara, los datos de la sesión se guardarán automáticamente en el backend como un archivo JSON.

## 📂 **Estructura del Proyecto**

src/
├── App.js              # Lógica principal de la aplicación
├── App.css             # Estilos globales
├── components/
│   ├── MiniGames.js    # Minijuegos interactivos
│   ├── Results.js      # Visualización de resultados
│   ├── MiniGame1.js    # Minijuego específico
├── server.js           # Servidor backend para guardar datos


## 💡 **Tecnologías Utilizadas**
Frontend: React.js
Backend: Node.js, Express
APIs: Morphcast, GazeRecorder
Análisis de datos: Python, OpenCV

## 📊 **Flujo de Trabajo**
Captura de Datos: Morphcast y GazeRecorder recopilan datos de emociones y mirada.
Almacenamiento: Los datos se guardan automáticamente como archivos JSON en el servidor.
Análisis: Los datos JSON son compatibles con OpenCV para análisis avanzado en Python.

## 🧪 **Pruebas y Depuración**
Verifica que el servidor esté activo en http://localhost:5000.
Asegúrate de que la cámara esté habilitada en tu navegador.
Revisa los archivos JSON generados para confirmar que los datos se guardan correctamente.
