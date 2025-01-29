from flask import Flask, request, jsonify
import psycopg2 as psycopg
import bcrypt
import jwt
from flask_cors import CORS

# Permitir solicitudes CORS
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# Configuración de la conexión a la base de datos PostgreSQL
DATABASE_URL = "postgresql://postgres:Nisemono27@localhost:5432/hikarishiftx"  # URL de la base de datos directamente

# Conectar a la base de datos
def get_db_connection():
    try:
        # Intentar conectar a la base de datos
        conn = psycopg.connect(DATABASE_URL)
        print("Conexión a la base de datos exitosa.")
        return conn
    except Exception as e:
        # Si ocurre un error, mostrar el mensaje de error
        print(f"Error al conectar a la base de datos: {e}")
        return None

# Verificar la conexión al iniciar el servidor
if get_db_connection() is None:
    print("No se pudo establecer la conexión a la base de datos. El servidor no se iniciará.")
else:
    print("El servidor está listo para recibir peticiones.")

# Ruta para registrar un nuevo usuario
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Verificar si el usuario ya existe
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
    user = cursor.fetchone()

    if user:
        print("El usuario ya existe")  # Agregar esta línea para depurar
        return jsonify({'success': False, 'message': 'El usuario ya existe'}), 400

    # Hashear la contraseña
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed_password_str = hashed_password.decode('utf-8')
    # Insertar el nuevo usuario en la base de datos
    cursor.execute('INSERT INTO users (email, password) VALUES (%s, %s)', (email, hashed_password_str))
    conn.commit()
    cursor.close()
    conn.close()

    print("Usuario registrado correctamente")  # Agregar esta línea para depurar
    return jsonify({'success': True, 'message': 'Usuario registrado correctamente'}), 201


# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Buscar al usuario por email
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 400

    # Verificar la contraseña
    stored_password = user[2]  # La contraseña está en el tercer campo (index 2)
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        return jsonify({'success': False, 'message': 'Credenciales incorrectas'}), 400

    # Crear un token JWT
    token = jwt.encode({'user_id': user[0]}, 'your_jwt_secret', algorithm='HS256')

    cursor.close()
    conn.close()

    return jsonify({'success': True, 'token': token})

# Iniciar el servidor
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
