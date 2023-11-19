from flask import Blueprint, jsonify, request
#token y permisos
from auth import token_required
#conector a bd
from database import ConnBD as bd

class Item():
    def __init__(self, row):
        self._id_item = row[0]
        self._nombre_producto = row[1]
        self._detalle = row[2]
        self._cantidad = row[3]
        self._precio_compra = row[4]
        self._precio_venta = row[5]
    def to_json(self):
        return {
        "id_item" : self._id_item,
        "nombre_producto" : self._nombre_producto,
        "detalle" : self._detalle,
        "cantidad" : self._cantidad,
        "precio_compra" : self._precio_compra,
        "precio_venta" : self._precio_venta
        }

itemHandler = Blueprint('item', __name__)
#test acceso a item
@itemHandler.route('/test')
def test(id):
    return jsonify({"message": "funcion test"})


#ver todos los items
@itemHandler.route('/<int:id>/getall', methods = ['GET'])
@token_required
def get_all_item(id):
    cur = bd.cursor()
    cur.execute('SELECT * FROM item')
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    items = []
    for row in data:
        objItem = Item(row)
        items.append(objItem.to_json())
    return jsonify( items )


#Consultar cliente por ID
@itemHandler.route('/<int:id>/byid/<int:id_item>', methods = ['GET'])
@token_required
def get_item_by_id(id,id_item):
    cur = bd.cursor()
    cur.execute('SELECT * FROM cliente WHERE id_item = {0}'.format(id_item))
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    if cur.rowcount > 0:
        objItem = Item(data[0])
        return jsonify( objItem.to_json() )
    return jsonify( {"message": "id not found"} )


#Consultar cliente por DNI
@itemHandler.route('/<int:id>/bycode/<int:code>', methods = ['GET'])
@token_required
def get_item_bycode(id,code):
    cur = bd.cursor()
    cur.execute('SELECT * FROM item WHERE codebar = {0}'.format(code))
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    if cur.rowcount > 0:
        objItem = Item(data[0])
        return jsonify( objItem.to_json() )
    return jsonify( {"message": "id not found"} )


#nuevo cliente verificando DNI existente
@itemHandler.route('/<int:id>/save', methods = ['POST'])
@token_required
def save_item(id):
    #lee el post
    nombre = request.get_json()["nombre"]
    apellido = request.get_json()["apellido"]
    dni = request.get_json()["dni"]

    #conecto a bd
    cur = bd.cursor()
    """ Control si existe el dni indicado """
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
    #comit la bd
    bd.commit()

    """ obtener el id del registro creado """
    cur.execute('SELECT MAX(id_cliente) AS ultimo_id FROM cliente;')
    row = cur.fetchone()
    print(row[0])
    id_cliente = row[0]
    return jsonify({"nombre": nombre, "apellido": apellido, "dni": dni, "id_cliente": id_cliente})


#actualizar datos de un cliente
@itemHandler.route('/<int:id>/update/<int:id_cliente>', methods = ['PUT'])
@token_required
def update_item(id, id_cliente):
    nombre = request.get_json()["nombre"]
    apellido = request.get_json()["apellido"]
    dni = request.get_json()["dni"]
    """ UPDATE SET ... WHERE ... """
    cur = bd.cursor()
    cur.execute('UPDATE cliente SET nombre = %s, apellido = %s, dni = %s WHERE id_cliente = %s', (nombre, apellido, dni, id_cliente))
    bd.commit()
    return jsonify({"id_cliente": id_cliente, "nombre": nombre, "apellido": apellido, "dni": dni})


#eliminar usuario (no practico)
@itemHandler.route('/delete/<int:id>', methods = ['DELETE'])
def remove_item(id):
    """ DELETE FROM WHERE... """
    cur = bd.cursor()
    cur.execute('DELETE FROM cliente WHERE id = {0}'.format(id))
    bd.commit()
    return jsonify({"message": "deleted", "id_cliente": id})

