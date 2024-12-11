from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/save_session_data', methods=['POST'])
def save_session_data():
    data = request.get_json()  # Obtiene los datos JSON de la solicitud
    print("Datos recibidos:", data)  # Puedes imprimir o guardar los datos
    # Aquí puedes procesar o guardar los datos como desees
    return jsonify({"message": "Datos recibidos correctamente"}), 200

if __name__ == '__main__':
    app.run(debug=True)
