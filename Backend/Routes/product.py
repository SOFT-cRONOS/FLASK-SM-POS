from flask import Blueprint, jsonify, request, session
#token y permisos
from auth import token_required

#Clases
from Models.product import Product
from BD.database import ConnBD as bd

productHandle = Blueprint('product', __name__)

@productHandle.route('/', methods = ['GET', 'POST'])
@token_required
def usersData():
    if request.method == 'GET':
        try:
            id_company = session['company']
            usersList = Product.getAllProduct(id_company)
            return usersList
        except Exception as e:
            return jsonify({"error de ruta": str(e)}), 500
    elif request.method == 'POST':
        pass
