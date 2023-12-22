from flask import Blueprint, jsonify, request, session
#token y permisos
from auth import token_required, user_resources

#Clases
from Models.product import *
from BD.database import ConnBD as bd

productHandle = Blueprint('product', __name__)

@productHandle.route('/', methods = ['GET', 'POST', 'PUT'])
@token_required
#@user_resources
def productData():
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
            return jsonify({"registro actualizado:": str(id_product)}), 200
        return jsonify({"API error:": "no id found"}), 401
    
@productHandle.route('/um', methods = ['GET', 'POST', 'PUT'])
@token_required
#@user_resources
def umData():
    if request.method == 'GET':
        try:
            List = Um.getUm()
            return List
        except Exception as e:
            return jsonify({"API error": str(e)}), 500
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        if 'id-um' in request.headers:
            print("es un put con id")
            id_um = request.headers['id-um']
            return jsonify({"registro actualizado:": str(id_um)}), 200
        return jsonify({"API error:": "no id found"}), 401
    
@productHandle.route('/category', methods = ['GET', 'POST', 'PUT'])
@token_required
#@user_resources
def categoryData():
    if request.method == 'GET':
        try:
            id_company = session['company']
            List = ProductCategory.getCompanyProductCategory(id_company)
            return List
        except Exception as e:
            return jsonify({"API error": str(e)}), 500
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        if 'id-product-category' in request.headers:
            print("es un put con id")
            id_product_category = request.headers['id-product-category']
            return jsonify({"registro actualizado:": str(id_product_category)}), 200
        return jsonify({"API error:": "no id found"}), 401
    
@productHandle.route('/discount', methods = ['GET', 'POST', 'PUT'])
@token_required
#@user_resources
def discountData():
    if request.method == 'GET':
        try:
            id_company = session['company']
            List = Discount.getDiscount(id_company),
            return List
        except Exception as e:
            return jsonify({"API error": str(e)}), 500
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        if 'id-discount' in request.headers:
            print("es un put con id")
            id_discount = request.headers['id-discount']
            return jsonify({"registro actualizado:": str(id_discount)}), 200
        return jsonify({"API error:": "no id found"}), 401

@productHandle.route('/brand', methods = ['GET', 'POST', 'PUT'])
@token_required
#@user_resources
def brandData():
    if request.method == 'GET':
        try:
            id_company = session['company']
            List = Brand.getBrand(id_company),
            return List
        except Exception as e:
            return jsonify({"API error": str(e)}), 500
    elif request.method == 'POST':
        pass
    elif request.method == 'PUT':
        if 'id-brand' in request.headers:
            print("es un put con id")
            id_brand = request.headers['id-discount']
            return jsonify({"registro actualizado:": str(id_brand)}), 200
        return jsonify({"API error:": "no id found"}), 401        