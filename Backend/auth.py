from flask import jsonify, request
import jwt
from functools import wraps

#Valores de configuracion
from config import appCfg



#validacion de token
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print("kwargs")
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
            appconfig = appCfg()
            data = jwt.decode(token , appconfig.getSecretKey() , algorithms = ['HS256'])
            token_id = data['id']

            if int(user_id) != int(token_id):
                return jsonify({"message": "Error de id"}), 401
            
        except Exception as e:
            print(e)
            return jsonify({"message": str(e)}), 401

        return func(*args, **kwargs)
    return decorated

#validacion recurso cliente
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

#validacion recurso usuario
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
