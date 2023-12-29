from flask import Flask, jsonify, request, session
import jwt
import datetime

#configuracion de conect BD
from BD.database import ConnBD as bd

#Funciones de autorizacion
from auth import token_required, user_resources

#Valores de configuracion
from config import appCfg

#Formato y funciones de login
from Routes.login import loginHandle
#formato y funciones de clientes
from Routes.user import userHandle
#formato y funciones de clientes
from Routes.product import productHandle


from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials = True, origins="*") # habilita las consultas externas ej navegador
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SECRET_KEY'] = appCfg.SecretKey()



@app.route('/')
def index():
    return jsonify({"message": "API desarrollada con Flask"})


# Registrar el Blueprint de clientes
app.register_blueprint(loginHandle, url_prefix='/login')
# Registrar el Blueprint de clientes
app.register_blueprint(userHandle, url_prefix='/user')
# Registrar el Blueprint de Productos
app.register_blueprint(productHandle, url_prefix='/product')


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