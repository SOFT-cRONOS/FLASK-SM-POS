from flask import Blueprint, jsonify, request
#token y permisos
from auth import token_required
#conector a bd
from BD.database import ConnBD as bd

class Product():
    def __init__(self, row):
        self._id_product = row[0]
        self._product_category_name = row[1]
        self._product_name = row[2]
        self._detail = row[3]
        self._brand_name = row[4]
        self._minimun_sell_units = row[5]
        self._stock = row[6]
        self._stock_alert = row[7]
        self._abbreviation = row[8]
        self._buy_price = row[9]
        self._gain_margin = row[10]
        self._sell_price = row[11]
        self._discount = row[12]
        self._supplier_name = row[13]
        self._score = row[14]
        self._product_status = row[15]
        self._link = row[16]
        self._company_name = row[17]

    def to_json(self):
        return {
            "id_" : self._id_product,
            "product_category_name": self._product_category_name,
            "product_name": self._product_name,
            "detail": self._detail,
            "brand_name": self._brand_name,
            "minimun_sell_units": self._minimun_sell_units,
            "stock": self._stock,
            "stock_alert": self._stock_alert,
            "abbreviation": self._abbreviation,
            "buy_price": self._buy_price,
            "gain_margin": self._gain_margin,
            "sell_price": self._sell_price,
            "discount": self._discount,
            "supplier_name": self._supplier_name,
            "score": self._score,
            "product_status": self._product_status,
            "link": self._link,
            "company_name": self._company_name
        }
    
    def productExist(barcode):
        pass

    def getAllProduct(id_company):
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            p.id_product,
                            pcat.product_category_name,
                            p.product_name,
                            p.detail,
                            b.brand_name,
                            p.minimun_sell_units,
                            p.stock,
                            p.stock_alert,
                            um.abbreviation,
                            p.buy_price,
                            p.gain_margin,
                            p.sell_price,
                            discount.discount,
                            supplier.supplier_name,
                            p.score,
                            p.product_status,
                            p.link,
                            c.company_name
                        FROM product p
                        JOIN product_category pcat ON p.id_product_category = pcat.id_product_category
                        JOIN brand b ON p.id_brand = b.id_brand
                        JOIN company_product cp ON p.id_product = cp.id_product
                        LEFT JOIN discount ON p.id_discount = discount.id_discount
                        JOIN supplier ON p.id_supplier = supplier.id_supplier
                        JOIN um ON p.id_um = um.id_um
                        JOIN company c ON cp.id_company = c.id_company
                        WHERE c.id_company = %s;
                                        ''',
                        (id_company,))
            resp = cur.fetchall()
            productList = []
            for row in resp:
                objProduct = Product(row)
                productList.append(objProduct.to_json())
            return jsonify(productList)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def getProductbyID(id_company, id_producto):
        pass

    def getProductbyBarcode(id_company, barcode):
        pass

    def newProduct(id_company):
        pass

    def updateProductData(id_product, data):
        pass

class Um():
    def __init__(self, row):
       self._id_um = row[0]
       self._property = row[1]
       self._abreviation = row[2]
       self._unit = row[3]
    def to_json(self):
        return {
            "id_um": self._id_um,
            "property": self._property,
            "abreviation": self._abreviation,
            "unit": self._unit
        }
    
    def getUm():
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            *
                        FROM UM
                        '''
                        )
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def getUmbyID(id_um):
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            *
                        FROM UM
                        WHERE id_um = %s
                        ''',
                        (id_um,))
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def newUm(data):
        unit = data["unit"]
        abbreviation = data["abreviation"]
        um_property = data["property"]

        try:
            cur = bd.cursor()
            cur.execute('''
                        INSERT INTO um
                        (unit, abbreviation, property) VALUES
                        (%s, %s, %s),
                        ''',
                        (unit, abbreviation, um_property,))
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def updateUm(data):
        id_um = data["id_um"]
        unit = data["unit"]
        abbreviation = data["abreviation"]
        um_property = data["property"]

        try:
            cur = bd.cursor()
            cur.execute('''
                        UPDATE um
                        SET unit = %s, 
                        abbreviation = %s, 
                        property = %s)
                        WHERE id_um = %s,
                        ''',
                        (unit, abbreviation, um_property, id_um,))
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def deleteUm(id_um):
        pass

class ProductCategory():
    def __init__(self, row):
       self._id_product_category = row[0]
       self._product_category_name = row[1]
       self._product_category_detail = row[2]
       self._id_discount = row[3]
       self._discount = row[4]
    def to_json(self):
        return {
            "id_product_category": self._id_product_category,
            "product_category_name": self._product_category_name,
            "product_category_detail": self._product_category_detail,
            "id_discount": self._id_discount,
            "discount": self._discount
        }
    
    def getCompanyProductCategory(id_company):
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            pc.id_product_category,
                            pc.product_category_name,
                            pc.product_category_detail,
                            pc.id_discount,
                            d.discount
                        FROM product_category AS pc
                        LEFT JOIN discount AS d
                        ON pc.id_discount = d.id_discount
                        WHERE pc.id_company = %s;                        
                        '''
                        ,(id_company,)) #tendria q traer tambien las condiciones de descuento
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def getCompanyProductCategorybyID(id_company, id_product_category):
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            pc.id_product_category,
                            pc.product_category_name,
                            pc.product_category_detail,
                            pc.id_discount,
                            d.discount
                        FROM product_category AS pc
                        INNER JOIN discount AS d
                            ON pc.id_discount = d.id_discount
                        WHERE 
                            pc.id_company = %s AND
                            pc.id_product_category = %s                       
                        ''',
                        (id_company, id_product_category,)) #tendria q traer tambien las condiciones de descuento
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close
    
class Discount():
    def __init__(self, row):
       self._id_discount = row[0]
       self._discount = row[1]
       self._discount_N_condition = row[2]
       self._discount_date_condition = row[3]
       self._discount_description = row[4]
    def to_json(self):
        return {
            "id_discount": self._id_discount,
            "discount": self._discount,
            "discount_N_condition": self._discount_N_condition,
            "discount_date_condition": self._discount_date_condition,
            "discount_description": self._discount_description
        }
    
    def getDiscount(id_company):
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            *
                        FROM discount
                        WHERE id_company = %s
                        '''
                        ,(id_company,))
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

    def getDiscountbyId(id_company, id_discount):
        try:
            cur = bd.cursor()
            cur.execute('''
                        SELECT
                            *
                        FROM discount
                        WHERE
                            id_company = %s AND 
                            id_discount = %s
                        '''
                        ,(id_company, id_discount,))
            resp = cur.fetchall()
            List = []
            for row in resp:
                objList= Product(row)
                List.append(objList.to_json())
            return jsonify(List)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            cur.close

class Brand():
    def __init__(self, row):
       self._id_brand = row[0]
       self._brand_name = row[1]
       self._brand_detail = row[2]
    def to_json(self):
        return {
            "id_brand": self._id_brand,
            "brand_name": self._brand_name,
            "brand_detail": self._brand_detail
        }

    def getBrand(id_company):
        pass

    def getBrandbyID(id_company, id_brand):
        pass

    def newBrand(id_company, data):
        pass

    def updateBrand(id_brand, data):
        pass
