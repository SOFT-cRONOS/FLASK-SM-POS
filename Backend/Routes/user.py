from flask import Blueprint, jsonify, request, session
#token y permisos
from auth import token_required

#Clases
from Models.user import *
from BD.database import ConnBD as bd

from flask_cors import CORS, cross_origin
userHandle = Blueprint('user', __name__)
#test acceso a clientes

@userHandle.route('/test')
@token_required
def test():
    return jsonify({"message": "funcion test"})

@userHandle.route('/test2')
@token_required
def test2():
    try:
        cur = bd.cursor()
        cur.execute ('''Select * FROM users''')
        resp = cur.fetchall()
        usersList = []
        for row in resp:
            objUser = User(row)
            print("caca",objUser.to_json)
            usersList.append(objUser.to_json())
        return jsonify(usersList)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cur.close()


#Obtener permisos de usuario
@userHandle.route('/permission/<int:id_user>', methods = ['GET', 'POST'])
def usersPermissions(id_user):
    if request.method == 'GET':
        try:
            userData = getUserPermission(id_user)
            return userData
        except Exception as e:
            return jsonify({"error de ruta": str(e)}), 500
    elif request.method == 'POST':
        pass

#ver todos los clientes
@userHandle.route('/<int:id_company>', methods = ['GET', 'POST'])
@token_required
def usersData(id_company):
    if request.method == 'GET':
        try:
            #id_company = session['company'] "lo ideal seria sacarlo del session"
            usersList = getCompanyUsers(id_company)
            return usersList
        except Exception as e:
            return jsonify({"error de ruta": str(e)}), 500
    elif request.method == 'POST':
        try:
            data = request.get_json()
            usersList = newCompanyUser(id_company, data)
            return usersList
        except Exception as e:
            return jsonify({"error de ruta": str(e)}), 500

#Consultar cliente por ID
@userHandle.route('/<int:id_user>', methods = ['GET', 'POST'])
@token_required
def usersDatabyId(id_user):
    if request.method == 'GET':
        try:
            id_company = session['company']
            print(id_company)
            userData = getCompanyUsersbyId(id_company, id_user)
            return userData
        except Exception as e:
            return jsonify({"message": str(e)}), 500
    elif request.method == 'POST':
        pass

