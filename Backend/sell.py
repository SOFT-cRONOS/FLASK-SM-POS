from flask import Blueprint, jsonify, request
#token y permisos
from auth import token_required, admin_resources
#conector a bd
from database import ConnBD as bd

class Sell():
    def __init__(self, row):
        self.id_venta = row[0]
        self.fecha = row[1]
        self.id_usuario = row[2]
        self.id_cliente = row[3]
        self.nombre_cliente = row[4]
        self.apellido_cliente = row[5]
        self.dni_cliente = row[6]
        self.cant_productos = row[7]
        self.total_venta = row[8]

    def to_json(self):
        return {
        "id_venta" : self.id_venta,
        "fecha" : self.fecha,
        "id_usuario" : self.id_usuario,
        "id_cliente" : self.id_cliente,
        "nombre_cliente" : self.nombre_cliente,
        "apellido_cliente" : self.apellido_cliente,
        "dni_cliente" : self.dni_cliente,
        "cant_prductos" : self.cant_productos,
        "total_venta" : self.total_venta
        }

class Sell_detail():
    def __init__(self, row):
        self.id_venta = row[0]
        self.nombre_producto = row[1]
        self.detalle_producto = row[2]
        self.cantidad_producto = row[3]
        self.precio_venta = row[4]
        self.subtotal = row[5]
    def to_json(self):
        return {
        "id_venta" : self.id_venta,
        "nombre_producto" : self.nombre_producto,
        "detalle_producto" : self.detalle_producto,
        "cantidad_producto" : self.cantidad_producto,
        "precio_venta" : self.precio_venta,
        "subtotal" : self.subtotal
        }
    
sellHandler = Blueprint('sell', __name__)
#test acceso a sell
@sellHandler.route('/test')
def test(id):
    return jsonify({"message": "funcion test"})


#ver todos las sells
@sellHandler.route('/<int:id>/getall', methods = ['GET'])
@token_required
def get_all_sell(id):
    cur = bd.cursor()
    cur.execute(''' SELECT DISTINCT v.id_venta, v.fecha , v.id_usuario, v.id_cliente, 
    c.nombre, c.apellido, c.dni,
    SUM(dv.cantidad) OVER (PARTITION BY v.id_venta) as cantidad, 
    SUM(dv.precio_u) OVER (PARTITION BY v.id_venta) as total
    FROM venta v
    INNER JOIN cliente c ON v.id_cliente = c.id_cliente
    INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta;''')
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    items = []
    for row in data:
        objSell = Sell(row)
        items.append(objSell.to_json())
    return jsonify( items )


#Consultar sell por ID
@sellHandler.route('/<int:id>/byid/<int:id_venta>', methods = ['GET'])
@token_required
def get_sell_by_id(id,id_venta):
    cur = bd.cursor()
    cur.execute('''' SELECT DISTINCT v.id_venta, v.fecha , v.id_usuario, v.id_cliente, 
    c.nombre, c.apellido, c.dni,
    SUM(dv.cantidad) OVER (PARTITION BY v.id_venta) as cantidad, 
    SUM(dv.precio_u) OVER (PARTITION BY v.id_venta) as total
    FROM venta v
    INNER JOIN cliente c ON v.id_cliente = c.id_cliente
    INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    WHERE v.id_venta =  = {0}'''.format(id_venta))

    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    if cur.rowcount > 0:
        objSell = Sell(data[0])
        return jsonify( objSell.to_json() )
    return jsonify( {"message": "id not found"} )


#Consultar sell por nº factura
@sellHandler.route('/<int:id>/bycode/<int:code>', methods = ['GET'])
@token_required
def get_sell_bycode(id,code):
    cur = bd.cursor()
    cur.execute('SELECT * FROM item WHERE codebar = {0}'.format(code))
    data = cur.fetchall()
    print(cur.rowcount)
    print(data)
    if cur.rowcount > 0:
        objItem = Item(data[0])
        return jsonify( objItem.to_json() )
    return jsonify( {"message": "id not found"} )


#nueva sell verificando numero existente
@sellHandler.route('/<int:id>/save', methods = ['POST'])
@token_required
def save_sell(id):
    #lee el post
    # code = request.get_json()["code"]
    fecha = request.get_json()["fecha"]
    id_usuario = request.get_json()["usuario"]
    id_cliente = request.get_json()["cliente"]

    #conecto a bd
    cur = bd.cursor()

    #acceso a BD -> INSERT INTO
    cur.execute('''INSERT INTO venta
                (fecha, id_usuario, id_cliente) VALUES
                (%s, %s, %s,%s)''', (fecha, id_usuario, id_cliente))
    #comit la bd
    bd.commit()

    """ obtener el id del registro creado """
    cur.execute('SELECT MAX(id_venta) AS ultimo_id FROM venta;')
    row = cur.fetchone()
    print(row[0])
    id_venta = row[0]
    return jsonify({"id_venta": id_venta, "fecha": fecha, 
                    "id_usuario": id_usuario, "id_cliente": id_cliente})

@sellHandler.route('/<int:id>/save_detall', methods = ['POST'])
@token_required
def save_selldetall(id):
    pass


#actualizar datos de una sell (administ)
@sellHandler.route('/<int:id>/update/<int:id_venta>', methods = ['PUT'])
@token_required
def update_sell(id, id_cliente):
    nombre = request.get_json()["nombre"]
    apellido = request.get_json()["apellido"]
    dni = request.get_json()["dni"]
    """ UPDATE SET ... WHERE ... """
    cur = bd.cursor()
    cur.execute('UPDATE cliente SET nombre = %s, apellido = %s, dni = %s WHERE id_cliente = %s', (nombre, apellido, dni, id_cliente))
    bd.commit()
    return jsonify({"id_cliente": id_cliente, "nombre": nombre, "apellido": apellido, "dni": dni})


#eliminar venta (no practico)
@sellHandler.route('/delete/<int:id>', methods = ['DELETE'])
@token_required
@admin_resources
def remove_sell(id):
    """ DELETE FROM WHERE... """
    cur = bd.cursor()
    cur.execute('DELETE FROM cliente WHERE id = {0}'.format(id))
    bd.commit()
    return jsonify({"message": "deleted", "id_cliente": id})

