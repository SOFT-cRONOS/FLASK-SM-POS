from flask import Blueprint, jsonify, request, session
#token y permisos
from auth import token_required, user_resources

#Clases
from Models.product import Product
from BD.database import ConnBD as bd

productHandle = Blueprint('product', __name__)

@productHandle.route('/', methods = ['GET', 'POST', 'PUT'])
@token_required
#@user_resources
def usersData():
    if request.method == 'GET':
        try:
            id_company = session['company']
            usersList = Product.getAllProduct(id_company)
            return usersList
        except Exception as e:
            return jsonify({"API error": str(e)}), 500
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        if 'id-product' in request.headers:
            print("es  un put con id")
            id_product = request.headers['id-product']
            return jsonify({"aca deberia actualizar el id:": str(id_product)}), 200
        return jsonify({"API error:": "no id_product found"}), 401
    
    
umHandle = Blueprint('um', __name__)
