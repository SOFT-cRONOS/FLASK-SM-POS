from flask import Flask, Blueprint, jsonify, request, session
import jwt
import datetime
#configuracion de conect BD
from BD.database import ConnBD as bd
#Clases usuario
from Models.user import User
#Valores de configuracion
from config import appCfg

loginHandle = Blueprint('login', __name__)

def regLogin(id_user):
    date_todey = datetime.datetime.utcnow()
    try:
        cur = bd.cursor()
        cur.execute('START TRANSACTION')
        cur.execute('''
                        INSERT INTO login_history
                        (id_users, login_date) VALUES
                        (%s,%s)
                        ''',
                        (id_user, date_todey))
        cur.execute('COMMIT')
    except Exception as e:
         return e
    finally:
         cur.close()

@loginHandle.route('/', methods = ['POST'])
def user_login():
    data = request.get_json()

    nik = data['username']
    password = data['password']
    
    """ Control: existen valores para la autenticacion? """
    if not nik or not password:
        return jsonify({"message": "No autorizado"}), 401       
            
    """ Control: existe y coincide el usuario en la BD? """
    try:
        cur = bd.cursor()
        cur.execute('''
                        Select users.id_users,
                                users.nik,
                                users.name_users,
                                users.lastname,
                                users.img,
                                users.email,
                                company_user.id_company  
                        FROM users
                        INNER JOIN company_user ON 
                                users.id_users = company_user.id_users
                        WHERE users.nik = %s AND users.pass = %s
                    '''
                    , (nik,password,))
        row = cur.fetchone()
    except Exception as e:
        return jsonify({"message": e}), 500
    finally:
        cur.close

    if not row:
       return jsonify({"message": "No autorizado"}), 401  
    
    id_user = row[0]
    nik = row[1]
    name_users = row[2]
    lastname = row[3]
    img = row[4]
    email = row[5]
    id_company = row[6]
    """ El usuario existe en la BD y coincide su contraseña """
    token = jwt.encode({'id': id_user,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=100)}, appCfg.SecretKey())
    #despues de generar token busco de q empresa es
    
    #Guardo datos de usuario en el session:
    session['id_user'] = id_user
    session['company'] = id_company

    #Guardo en el historial de login
    regLogin(id_user)
    #cambiio el estado del usuario a conectado

    return jsonify({"token": token, "username": nik , "id": id_user})