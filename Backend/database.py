import mysql.connector
# from mysql.connector import Error
# ConnBD = mysql.connector.connect(host='172.17.0.2',
#                              database='flaskpos',
#                              user='admin',
#                              password='flaskpass')

# app.config['MYSQL_HOST'] = '172.17.0.2'
# app.config['MYSQL_USER'] = 'admin'
# app.config['MYSQL_PASSWORD'] ='flaskpass'
# app.config['MYSQL_DB'] = 'flaskpos'

ConnBD = mysql.connector.connect(host='127.0.0.1',
                             database='flaskpos',
                             user='admin',
                             password='flaskpass')