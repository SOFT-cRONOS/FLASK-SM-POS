from flask import Blueprint, jsonify, request
#conector a bd
from BD.database import ConnBD as bd

class User():
    def __init__(self, row):
        self._id_users = row[0]
        self._nik = row[1]
        self._cuil = row[2]
        self._cuit = row[3]
        self._name_users = row[4]
        self._lastname = row[5]
        self._pass = row[6]
        self._img = row[7]
        self._home_address = row[8]
        self._number_address = row[9]
        self._department = row[10]
        self._phone = row[11]
        self._email = row[12]
    def to_json(self):
        return {
            "id" : self._id_users,
            "nik": self._nik,
            "cuil": self._cuil,
            "cuit": self._cuit,
            "name_users": self._name_users,
            "lastname": self._lastname,
            "pass": self._pass,
            "img": self._img,
            "home_address": self._home_address,
            "number_address": self._number_address,
            "department": self._department,
            "phone": self._phone,
            "email": self._email,
        }

    def getUserbyCredencials(nik, password):
        try:
            with bd.cursor() as cur:
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
                                WHERE users.nik = %s AND users.pass = %s'
                            '''
                            , (nik,password,))
                resp = cur.fetchone()
                clientes = []
                for row in resp:
                    objUser = User(row)
                    clientes.append(objUser.to_json())
                return jsonify(clientes)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def getUserbyID(id_user):
        try:
            with bd.cursor() as cur:
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
                                WHERE users.id_users = %s;
                            '''
                            , (id_user,))
                resp = cur.fetchall()
                clientes = []
                for row in resp:
                    objUser = User(row)
                    clientes.append(objUser.to_json())
                return jsonify(clientes)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

class UserPermission():
    def __init__(self, row):
        self._permission_name = row[0]
    def to_json(self):
        return {
            "permission_name": self._permission_name
        }

def getUserExist(id_company, cuil, cuit):
    try:
        cur = bd.cursor()
        """ Control si existe el dni indicado """
        cur.execute('''
                        Select *
                        FROM users
                        INNER JOIN company_user ON 
                                users.id_users = company_user.id_users
                        WHERE company_user.id_company = %s
                        AND (users.cuit = %s OR
                            users.cuil = %s)
                    ''', (id_company, cuit, cuil))
        #apunto a la fila
        row = cur.fetchall()
        #si hay una fila es porq ya existe
        if row:
            #retorna y termina
            return 1
        return 0
    except Exception as e:
        return e

def getUserPermission(id_user):
    try:
        cur = bd.cursor()
        cur.execute ('''
                        SELECT p.permission_name
                        FROM users u
                        JOIN users_role ur ON u.id_users = ur.id_users
                        JOIN role_permissions rp ON ur.id_role = rp.id_role
                        JOIN permissions p ON rp.id_permission = p.id_permission
                        WHERE u.id_users = %s;
                     '''
                     , (id_user,))
        resp = cur.fetchall()
        usersList = []
        for row in resp:
            objUser = UserPermission(row)
            usersList.append(objUser.to_json())
        return jsonify(usersList)
    except Exception as e:
        return jsonify({"error": str(e)})   

def getCompanyUsers(id_company):
    try:
        cur = bd.cursor()
        cur.execute ('''
                         Select users.id_users,
                                users.nik,
                                users.cuil,
                                users.cuit,
                                users.name_users,
                                users.lastname,
                                users.pass,
                                users.img,
                                users.home_address,
                                users.number_address,
                                users.department,
                                users.phone,
                                users.email
                        FROM users
                        INNER JOIN company_user ON 
                                users.id_users = company_user.id_users
                        WHERE company_user.id_company = %s;
                     '''
                     , (id_company,))
        resp = cur.fetchall()
        usersList = []
        for row in resp:
            objUser = User(row)
            usersList.append(objUser.to_json())
        return jsonify(usersList)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cur.close

def getCompanyUsersbyId(id_company, id_user):
    try:
        with bd.cursor() as cur:
            cur.execute('''
                             Select users.id_users,
                                    users.nik,
                                    users.cuil,
                                    users.cuit,
                                    users.name_users,
                                    users.lastname,
                                    users.pass,
                                    users.img,
                                    users.home_address,
                                    users.number_address,
                                    users.department,
                                    users.phone,
                                    users.email
                            FROM users
                            INNER JOIN company_user ON 
                                    users.id_users = company_user.id_users
                            WHERE company_user.id_company = %s
                            AND users.id_users = %s;
                         '''
                         , (id_company, id_user,))
            resp = cur.fetchall()
            clientes = []
            for row in resp:
                objUser = User(row)
                clientes.append(objUser.to_json())
            return jsonify(clientes)
    except Exception as e:
        return jsonify({"error": str(e)})

def newCompanyUser (id_company, data):
    #id_user = data["id_user"]
    nik = data["nik"]
    cuil = data["cuil"]
    cuit = data["cuit"]
    name_users = data["name_users"]
    lastname = data["lastname"]
    password = data["pass"]
    img = data["img"]
    home_address = data["home_address"]
    number_address = data["number_address"]
    department = data["department"]
    phone = data["phone"]
    email = data["email"]
    """ Control si existe el cuil o cuit indicado """ 
    chekUser = getUserExist(id_company, cuil, cuit)
    if chekUser == 1:
        print("a la verga")
        return jsonify({"message": "cuil/cuit registrado"}), 401
    try:
        print("paso igual")
        cur = bd.cursor()
        cur.execute('START TRANSACTION')
        cur.execute('''
                    INSERT INTO users 
                    (nik, cuil, name_users, lastname, pass, img, home_address, number_address, department, phone, email, life_state) VALUES
                    (%s,%s,%s,%s,%s, %s,%s,%s,%s, %s,%s,%s)
                    ''', 
                    (nik, cuil,name_users,lastname,password,img,home_address,number_address,department,phone,email,0))
        cur.execute('''
                        SELECT MAX(users.id_users) AS id FROM users;
                    ''')
        resp = cur.fetchall()
        id_user = resp[0][0]
        cur.execute('''
                    INSERT INTO  company_user 
                    ( id_users, id_company ) VALUES
                    (%s, %s)''', (id_user, id_company))
        cur.execute('COMMIT')
        print(cur)
        return jsonify({"message":200})
    except Exception as e:
        cur.execute('ROLLBACK')
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()

def addUserPermission(id_user, id_permission):
    pass

def updateUserData(id_user, *data):
    pass

