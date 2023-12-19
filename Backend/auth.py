from flask import jsonify, request
import jwt
from functools import wraps

#Valores de configuracion
from config import appCfg
#configuracion de conect BD
from BD.database import ConnBD as bd
#users class for sql
from Models.user import getUserPermission

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
            # Extrae el ID de usuario asociado al cliente
            id_prop = data[0]
            # Obtiene el ID de usuario desde las cabeceras de la solicitud
            user_id = request.headers['user-id']
            # Compara los IDs para asegurarse de que el usuario tiene acceso al recurso del usuario
            if int(id_prop) != int(user_id):
                # Si no tiene acceso, devuelve un mensaje de error y un código de estado 401 (No autorizado)
                return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        # Si todo está en orden, ejecuta la función original
        return func(*args, **kwargs)
    # Devuelve la función decorada
    return decorated

#validacion recurso usuario
def user_resourcesORIGIN(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        # Imprime los argumentos pasados al decorador
        print("Argumentos en user_resources: ", kwargs)
        # Extrae el ID de usuario desde la ruta (path) de la solicitud
        id_user_route = kwargs['id_user']
        # Obtiene el ID de usuario desde las cabeceras de la solicitud
        user_id = request.headers['user-id']
        # Compara los IDs para asegurarse de que el usuario tiene acceso al recurso del usuario
        if int(id_user_route) != int(user_id):
            # Si no tiene acceso, devuelve un mensaje de error y un código de estado 401 (No autorizado)
            return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        # Si todo está en orden, ejecuta la función original
        return func(*args, **kwargs)
    # Devuelve la función decorada
    return decorated

#validacion recurso usuario
def user_resources(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        # Imprime los argumentos pasados al decorador
        print("Argumentos en user_resources: ", kwargs)
        # Extrae el ID de usuario desde la ruta (path) de la solicitud
        id_user_route = kwargs['id_user']
        # Obtiene el ID de usuario desde las cabeceras de la solicitud
        user_id = request.headers['user-id']
        # Compara los IDs para asegurarse de que el usuario tiene acceso al recurso del usuario
        if int(id_user_route) != int(user_id):
            # Si no tiene acceso, devuelve un mensaje de error y un código de estado 401 (No autorizado)
            return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        #Ahora chequea q tenga permisos para la operacion
        if request.method == 'PUT':
            user_permissions = getUserPermission(user_id)
            print(user_permissions) #aca deveria consultar si tiene permisos de u (Update)
        # Si todo está en orden, ejecuta la función original
        return func(*args, **kwargs)
    # Devuelve la función decorada
    return decorated

#validacion recurso admin
def admin_resources(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print("Argumentos en admin_resources: ", kwargs)
        id_cliente = kwargs['id_client']
        cur = bd.cursor()
        cur.execute('SELECT id_user FROM client WHERE id = {0}'.format(id_cliente)) 
        data = cur.fetchone()
        if data:
            """ print(data) """
            # Extrae el ID de usuario asociado al cliente
            id_prop = data[0]
            # Obtiene el ID de usuario desde las cabeceras de la solicitud
            user_id = request.headers['user-id']
            # Compara los IDs para asegurarse de que el usuario tiene acceso al recurso del usuario
            if int(id_prop) != int(user_id):
                # Si no tiene acceso, devuelve un mensaje de error y un código de estado 401 (No autorizado)
                return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        # Si todo está en orden, ejecuta la función original
        return func(*args, **kwargs)
    # Devuelve la función decorada
    return decorated