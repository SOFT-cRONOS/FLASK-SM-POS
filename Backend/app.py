from flask import Flask, jsonify, request
import jwt
import datetime

#configuracion de conect BD
from database import ConnBD as bd

#Funciones de autorizacion
from auth import token_required, user_resources

#Valores de configuracion
from config import appCfg

#formato y funciones de clientes
from client import Client, clientHandler
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # habilita las consultas externas ej navegador
app.config['CORS_HEADERS'] = 'Content-Type'# habilita las consultas externas ej navegador
appconfig = appCfg()
app.config['SECRET_KEY'] = appconfig.getSecretKey()


@app.route('/')
def index():
    return jsonify({"message": "API desarrollada con Flask"})


@app.route('/login', methods = ['POST'])
def user_login():
    auth = request.authorization
    print(auth)
    """ Control: existen valores para la autenticacion? """
    if not auth or not auth.username or not auth.password:
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
# Registrar el Blueprint de clientes
app.register_blueprint(clientHandler, url_prefix='/client')





#Consultar Clientes
# @app.route('/client', methods = ['GET'])
# def get_all_client():
#     cur = bd.cursor()
#     cur.execute('SELECT * FROM cliente')
#     data = cur.fetchall()
#     print(cur.rowcount)
#     print(data)
#     clientes = []
#     for row in data:
#         objClient = Client(row)
#         clientes.append(objClient.to_json())
#     return jsonify( clientes )


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