

from flask import Flask, jsonify, request

import mysql.connector
# from mysql.connector import Error


from client import Client
import jwt
import datetime
from functools import wraps
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # habilita las consultas externas ej navegador

# app.config['MYSQL_HOST'] = '172.17.0.2'
# app.config['MYSQL_USER'] = 'admin'
# app.config['MYSQL_PASSWORD'] ='flaskpass'
# app.config['MYSQL_DB'] = 'flaskpos'

# app.config['SECRET_KEY'] = 'app_123'

# bd = mysql.connector.connect(host='172.17.0.2',
#                             database='flaskpos',
#                             user='admin',
#                             password='flaskpass')

bd = mysql.connector.connect(host='127.0.0.1',
                            database='flaskpos',
                            user='admin',
                            password='flaskpass')

@app.route('/')
def index():
    return jsonify({"message": "API desarrollada con Flask"})


@app.route('/login', methods = ['POST'])
def login():
    auth = request.authorization
    print(auth)

    """ Control: existen valores para la autenticacion? """
    if not auth or not auth.usuario or not auth.password:
        return jsonify({"message": "No autorizado"}), 401       
            
    """ Control: existe y coincide el usuario en la BD? """
    cur = bd.cursor()
    cur.execute('SELECT * FROM usuario WHERE nik = %s AND pass = %s', (auth.username, auth.password))
    row = cur.fetchone()

    if not row:
       return jsonify({"message": "No autorizado"}), 401  
    
    """ El usuario existe en la BD y coincide su contraseña """
    token = jwt.encode({'id': row[0],
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=100)}, app.config['SECRET_KEY'])

    return jsonify({"token": token, "username": auth.username , "id": row[0]})

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print(kwargs)
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({"message": "Falta el token"}), 401
        
        user_id = None

        if 'user-id' in request.headers:
            user_id = request.headers['user-id']

        if not user_id:
            return jsonify({"message": "Falta el usuario"}), 401
        
        try:
            data = jwt.decode(token , app.config['SECRET_KEY'], algorithms = ['HS256'])
            token_id = data['id']

            if int(user_id) != int(token_id):
                return jsonify({"message": "Error de id"}), 401
            
        except Exception as e:
            print(e)
            return jsonify({"message": str(e)}), 401

        return func(*args, **kwargs)
    return decorated


def client_resource(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print("Argumentos en client_resource: ", kwargs)
        id_cliente = kwargs['id_client']
        cur = bd.cursor()
        cur.execute('SELECT id_user FROM client WHERE id = {0}'.format(id_cliente)) 
        data = cur.fetchone()
        if data:
            """ print(data) """
            id_prop = data[0]
            user_id = request.headers['user-id']
            if int(id_prop) != int(user_id):
                return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        return func(*args, **kwargs)
    return decorated

def user_resources(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print("Argumentos en user_resources: ", kwargs)
        id_user_route = kwargs['id_user']
        user_id = request.headers['user-id']
        if int(id_user_route) != int(user_id):
            return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        return func(*args, **kwargs)
    return decorated

@app.route('/test/<int:id>')
@token_required
def test(id):
    return jsonify({"message": "funcion test"})



#Consultar usuarios
@app.route('/client', methods = ['GET'])
def get_all_client():
    cur = bd.cursor()
    cur.execute('SELECT * FROM cliente')
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    clientes = []
    for row in data:
        objClient = Client(row)
        clientes.append(objClient.to_json())
    return jsonify( clientes )

#Consultar usuario por ID
@app.route('/client/<int:id>', methods = ['GET'])
def get_client_by_id(id):
    cur = bd.cursor()
    cur.execute('SELECT * FROM cliente WHERE id_cliente = {0}'.format(id))
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    if cur.rowcount > 0:
        objClient = Client(data[0])
        return jsonify( objClient.to_json() )
    return jsonify( {"message": "id not found"} )


#nuevo usaurio verificando DNI existente
@app.route('/client', methods = ['POST'])
def new_client():
    #lee el post
    nombre = request.get_json()["nombre"]
    apellido = request.get_json()["apellido"]
    dni = request.get_json()["dni"]

    #conecto a bd
    cur = bd.cursor()
    """ Control si existe el email indicado """
    cur.execute('SELECT * FROM cliente WHERE dni = %s', (dni,))
    #apunto a la fila
    row = cur.fetchone()
    #si hay una fila es porq ya existe
    if row:
        #retorna y termina
        return jsonify({"message": "email ya registrado"})

    #acceso a BD -> INSERT INTO
    cur.execute('''INSERT INTO cliente (nombre, apellido, dni) VALUES
                 (%s, %s, %s)''', (nombre, apellido, dni))
    #comint la bd
    bd.commit()

    """ obtener el id del registro creado """
    cur.execute('SELECT LAST_INSERT_ID()')
    row = cur.fetchone()
    print(row[0])
    id = row[0]
    return jsonify({"nombre": nombre, "apellido": apellido, "dni": dni, "id": id})


#actualizar datos de un usuario
@app.route('/client/<int:id>', methods = ['PUT'])
def update_client(id):
    nombre = request.get_json()["nombre"]
    apellido = request.get_json()["apellido"]
    dni = request.get_json()["dni"]
    """ UPDATE SET ... WHERE ... """
    cur = bd.cursor()
    cur.execute('UPDATE person SET nombre = %s, apellido = %s, dni = %s WHERE id = %s', (nombre, apellido, dni, id))
    bd.commit()
    return jsonify({"id": id, "nombre": nombre, "apellido": apellido, "dni": dni})

#eliminar usuario (no practico)
@app.route('/client/<int:id>', methods = ['DELETE'])
def remove_client(id):
    """ DELETE FROM WHERE... """
    cur = bd.cursor()
    cur.execute('DELETE FROM cliente WHERE id = {0}'.format(id))
    bd.commit()
    return jsonify({"message": "deleted", "id": id})


# @app.route('/user/<int:id_user>/client/<int:id_client>', methods = ['GET'])
# @token_required
# @user_resources
# @client_resource

# def get_client_by_id(id_user, id_client):
#     cur = bd.cursor()
#     cur.execute('SELECT * FROM client WHERE id = {0}'.format(id_client))
#     data = cur.fetchall()
#     print(cur.rowcount)
#     print(data)
#     if cur.rowcount > 0:
#         objClient = Client(data[0])
#         return jsonify( objClient.to_json() )
#     return jsonify( {"message": "id not found"} ), 404


@app.route('/user/<int:id_user>/client', methods = ['GET'])
@token_required
@user_resources
def get_all_clients_by_user_id(id_user):
    cur = bd.cursor()
    cur.execute('SELECT * FROM client WHERE id_user = {0}'.format(id_user))
    data = cur.fetchall()
    clientList = []
    for row in data:
        objClient = Client(row)
        clientList.append(objClient.to_json())
    
    return jsonify(clientList)

















if __name__ == '__main__':
    app.run(debug=True, port=4500)