from flask import Flask, request, jsonify
import psycopg
import cv2  # OpenCV
import json

app = Flask(__name__)

# Configuración de la base de datos PostgreSQL
DB_CONFIG = {
    "dbname": "tu_base_de_datos",
    "user": "tu_usuario",
    "password": "tu_contraseña",
    "host": "localhost",
    "port": 5432
}

def connect_db():
    """Establece conexión con la base de datos PostgreSQL usando psycopg3."""
    conn = psycopg.connect(**DB_CONFIG)
    return conn

@app.route('/analyze', methods=['POST'])
def analyze_data():
    """Recibe datos JSON, los analiza y los almacena en PostgreSQL."""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No se enviaron datos"}), 400

    # Análisis con OpenCV o procesamiento de datos
    try:
        # Simulación de procesamiento con OpenCV (ajusta según tus necesidades)
        for entry in data.get('morphcast', []):
            # Ejemplo: Reemplazar `entry` con imagen si aplica
            print(f"Procesando entrada: {entry}")
            # Aquí podrías usar funciones de OpenCV, por ejemplo:
            # img = cv2.imread('path/to/image.jpg')
            # processed_img = cv2.Canny(img, 100, 200)
            print("Procesamiento simulado con OpenCV.")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Guardar datos en la base de datos PostgreSQL
    try:
        conn = connect_db()
        query = "INSERT INTO session_data (data) VALUES ($1)"
        # Usamos una lista con los datos a insertar
        data_to_insert = [(json.dumps(entry),) for entry in data.get("morphcast", [])]

        # Inserta los datos en la base de datos en una única operación
        with conn.cursor() as cursor:
            cursor.executemany(query, data_to_insert)

        conn.commit()
        conn.close()
    except Exception as e:
        return jsonify({"db_error": str(e)}), 500

    return jsonify({"message": "Datos procesados y almacenados exitosamente"}), 200

if __name__ == '__main__':
    app.run(debug=True)
