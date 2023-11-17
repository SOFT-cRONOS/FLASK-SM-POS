from flask import Blueprint, jsonify, request
#token y permisos
from auth import token_required
#conector a bd
from database import ConnBD as bd

class Client():
    def __init__(self, row):
        self._id = row[0]
        self._nombre = row[1]
        self._apellido = row[2]
        self._dni = row[3]
    def to_json(self):
        return {
            "id" : self._id,
            "nombre" : self._nombre,
            "apellido" : self._apellido,
            "dni" : self._dni
        }

clientHandler = Blueprint('client', __name__)
#test acceso a clientes
@clientHandler.route('/<int:id>/test')
@token_required
def test(id):
    return jsonify({"message": "funcion test"})


#ver todos los clientes
@clientHandler.route('/<int:id>/getall', methods = ['GET'])
@token_required
def get_all_client(id):
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

#Consultar cliente por ID
@clientHandler.route('/<int:id>/byid/<int:id_cliente>', methods = ['GET'])
#el primer id es el usuario verifica el token, el segundo es el de la consulta
def get_client_by_id(id,id_cliente):
    cur = bd.cursor()
    cur.execute('SELECT * FROM cliente WHERE id_cliente = {0}'.format(id_cliente))
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    if cur.rowcount > 0:
        objClient = Client(data[0])
        return jsonify( objClient.to_json() )
    return jsonify( {"message": "id not found"} )


#nuevo cliente verificando DNI existente
@clientHandler.route('/new', methods = ['POST'])
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


#actualizar datos de un cliente
@clientHandler.route('/update/<int:id>', methods = ['PUT'])
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
@clientHandler.route('/delete/<int:id>', methods = ['DELETE'])
def remove_client(id):
    """ DELETE FROM WHERE... """
    cur = bd.cursor()
    cur.execute('DELETE FROM cliente WHERE id = {0}'.format(id))
    bd.commit()
    return jsonify({"message": "deleted", "id": id})

