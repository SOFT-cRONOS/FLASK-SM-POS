-- ###########################################################################
-- ######## TERMINOS PREVIOS:                                         ######## 
-- ######## installment = Cuota mensual                               ########
-- ######## supplier = proveedor                                      ########
-- ########################################################################### 

-- CREATE users 'admin'@'%' IDENTIFIED VIA mysql_native_password USING '***';
-- GRANT USAGE ON *.* TO 'admin'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_users_CONNECTIONS 0; 
--  GRANT ALL PRIVILEGES ON `flaskpos`.* TO 'admin'@'%' WITH GRANT OPTION; 




drop database tester;
CREATE DATABASE IF NOT EXISTS tester;

USE tester;
-- ##############################################################################################################
-- ····························           SECCION CIUDAD      ···················································
CREATE TABLE location (
    id_location int PRIMARY KEY AUTO_INCREMENT,
    location_name varchar(20),
    location_prefix int
);

CREATE TABLE estate (
    id_estate int PRIMARY KEY AUTO_INCREMENT,
    id_location int,
    estate_name varchar(20),
    estate_prefix int,
    FOREIGN KEY (id_location) REFERENCES location(id_location)
);

CREATE TABLE city (
    id_city int PRIMARY KEY AUTO_INCREMENT,
    id_estate int,
    city_name varchar(20),
    city_prefix int,
    postal_code int,
    FOREIGN KEY (id_estate) REFERENCES estate(id_estate)
);

INSERT INTO location (location_name, location_prefix) VALUES(
     'Argentina', 54
);

INSERT INTO  estate ( id_location, estate_name, estate_prefix ) VALUES(
     1, 'Buenos Aires', null
);

INSERT INTO city ( id_estate, city_name, city_prefix, postal_code  ) VALUES(
     1, 'Punta Alta', 2932, 8109
);

-- ##############################################################################################################
-- ····························          SECCION USUARIOS     ···················································
-- Tabla para roles
CREATE TABLE role (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(15) NOT NULL,
    description_role VARCHAR(50)
);

-- Tabla para permisos
CREATE TABLE permissions (
    id_permission INT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(20) NOT NULL,
    description_permissions varchar(50)
);

-- Tabla para usuarios
CREATE TABLE users (
    id_users INT PRIMARY KEY AUTO_INCREMENT,
    nik VARCHAR(20) NOT NULL,
    cuil varchar(11) NOT NULL, -- Alterna con DNI
    cuit varchar(11),
    name_users VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    img VARCHAR(255),
    home_address VARCHAR(30),
    number_address INT(4),
    department VARCHAR(4),
    phone INT,
    email VARCHAR(50) NOT NULL,
    life_state INT(1),
    log_state BOOLEAN,
    id_city int,
    FOREIGN KEY (id_city) REFERENCES city(id_city)
);

-- Tabla para asignar permisos a role
CREATE TABLE role_permissions (
    id_role INT,
    id_permission INT,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES role(id_role),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

-- Tabla para asignar roles a usuarios
CREATE TABLE users_role (
    id_users INT,
    id_role INT,
    PRIMARY KEY (id_users, id_role),
    FOREIGN KEY (id_users) REFERENCES users(id_users),
    FOREIGN KEY (id_role) REFERENCES role(id_role)
);

CREATE TABLE login_history (
    id_login INT PRIMARY KEY AUTO_INCREMENT,
    id_users INT,
    login_date DATETIME NOT NULL,
    logout_date DATETIME,
    FOREIGN KEY (id_users) REFERENCES users(id_users)
);

-- Insert de prueba para tablas usuarios y roles

-- Insertar roles
INSERT INTO role (role_name, description_role) VALUES 
('Usuario', 'Rol estándar para usuarios registrados'),
('Cliente', 'Rol para clientes con ciertos privilegios'),
('Admin', 'Rol de administrador con todos los privilegios');

-- Insertar ejemplos de permisos
INSERT INTO permissions (permission_name) VALUES
('Read'),
('Write'),
('Delete'),
('Create');

-- Insertar usuarios
INSERT INTO users (nik, cuil, name_users, lastname, pass, img, home_address, number_address, department, phone, email, life_state) VALUES
('usuario1','23235412541', 'Juan', 'Pérez', 'contrasena1hash', NULL, 'Calle Principal', 123, 'A', 123456789, 'juan@email.com', 1),
('usuario2','54235412547', 'María', 'Gómez', 'contrasena2hash', NULL, 'Avenida Secundaria', 456, 'B', 987654321, 'maria@email.com', 1),
('admin1','24547623762', 'Admin', 'Master', 'adminpasshash', NULL, 'Calle Admin', 789, 'C', 555555555, 'admin@email.com', 0);

-- Insertar asignación de permisos a role
INSERT INTO role_permissions (id_role, id_permission) VALUES
(1, 1),
(2, 2),
(3, 1),
(3, 2),
(3, 3);

-- Insertar asignación de roles a usuarios
INSERT INTO users_role (id_users, id_role) VALUES
(1, 1),
(2, 2),
(3, 3);

-- ##############################################################################################################
-- ····························          SECCION EMPRESA      ···················································
CREATE TABLE company (
    id_company int PRIMARY KEY AUTO_INCREMENT,
    company_name varchar(20) not null,
    company_slogan varchar(40),
    company_img varchar(250),
    company_address varchar(40),
    company_number_address int,
    company_floor varchar(4),
    id_city int,
    FOREIGN KEY (id_city) REFERENCES city(id_city)
);

CREATE TABLE company_user (
    id_company_use int PRIMARY KEY AUTO_INCREMENT,
    id_users int,
    id_company int,
    FOREIGN KEY (id_users) REFERENCES users(id_users),
    FOREIGN KEY (id_company) REFERENCES company(id_company)
);

CREATE TABLE company_product (
    id_company_product int PRIMARY KEY AUTO_INCREMENT,
    id_product int,
    id_company int,
    FOREIGN KEY (id_product) REFERENCES product(id_product),
    FOREIGN KEY (id_company) REFERENCES company(id_company)
);

INSERT INTO company ( company_name, company_slogan, id_city) VALUES(
     'SM Diseño', 'Papeleria personalizada', 1
);
INSERT INTO  company_user ( id_users, id_company) VALUES(
     1, 1
);
INSERT INTO  company_product ( id_product, id_company) VALUES(
     1, 1
);


-- ##############################################################################################################
-- ···························· SECCION PRODUCTOS E INVENTARIO ···················································
CREATE TABLE supplier (
    id_supplier int PRIMARY KEY AUTO_INCREMENT,
    supplier_name varchar(40),
    supplier_web varchar(255),
    supplier_address varchar(255),
    supplier_number_address int(3),
    supplier_departament varchar(4),
    supplier_phone varchar(11),
    id_city int
);

INSERT INTO supplier
(supplier_name, supplier_web, supplier_address, supplier_number_address, supplier_departament, supplier_phone) VALUES
('art-jet', 'art-jet.com', 'capi', '233', '', '01123123');


CREATE TABLE brand (
    id_brand int PRIMARY KEY AUTO_INCREMENT,
    brand_name varchar(20),
    brand_detail varchar(50)
);

INSERT INTO brand
(brand_name, brand_detail) VALUES
('art-jet', 'hojas fotograficas'),
('aqx', 'hojas fotograficas economicas');

CREATE TABLE um (
    id_um int PRIMARY KEY AUTO_INCREMENT,
    property varchar(25), 
    abbreviation varchar(3), -- g, kg
    unit varchar(10)-- gramos, kilo gramos
);

INSERT INTO um
(unit, abbreviation, property) VALUES
('gramos', 'g', 'gramos de producto'),
('unidad', 'u', 'cada producto, unidad');

CREATE TABLE discount (
    id_discount int PRIMARY KEY AUTO_INCREMENT,
    discount int,
    discount_N_condition int,
    discount_date_condition JSON, -- json con dias
    discount_description varchar(50)
);

INSERT INTO discount 
(discount, discount_N_condition, discount_date_condition, discount_description) VALUES
(5, 100, null, null),
(3, null, '{"l": 0, "m": 1, "x":0, "j":0, "v": 0, "s":0, "d": 1}', 'descuento de dias martes y domingo');

CREATE TABLE product_category (
    id_product_category int PRIMARY KEY AUTO_INCREMENT,
    product_category_name varchar(20) NOT NULL,
    product_category_detail varchar(50),
    id_discount int,
    FOREIGN KEY (id_discount) REFERENCES discount(id_discount)
);

INSERT INTO product_category
(product_category_name, product_category_detail, id_discount) VALUES
('hojas', 'hojas fotograficas',null),
('vinilo', 'vinilo de corte', 2);


CREATE TABLE product (
    id_product int PRIMARY KEY AUTO_INCREMENT,
    id_product_category int default 1,
    product_name varchar(20),
    detail varchar(50),
    id_brand int,
    minimun_sell_units decimal(10,2),
    stock int,
    stock_alert int,
    id_um int DEFAULT 1,
    buy_price decimal(10,2) not null,
    gain_margin int,
    sell_price decimal(10,2),
    id_discount int,
    id_supplier int, -- proveedor
    score TINYINT UNSIGNED NOT NULL DEFAULT 0, -- CHECK (nombre_columna >= 0 AND nombre_columna <= 5),
    product_status int,
    link varchar(255),
    FOREIGN KEY (id_brand) REFERENCES brand(id_brand),
    FOREIGN KEY (id_product_category) REFERENCES product_category(id_product_category),
    FOREIGN KEY (id_um) REFERENCES um(id_um),
    FOREIGN KEY (id_supplier) REFERENCES supplier(id_supplier),
    FOREIGN KEY (id_discount) REFERENCES discount(id_discount)
);

INSERT INTO product
(id_product_category, product_name,id_brand, stock, stock_alert, id_um, buy_price, gain_margin, sell_price, id_supplier) VALUES
(1,'hoja fotografica', 1, 100, 5, 2, 100.00, 35, 135.00, 1);


-- ##############################################################################################################
-- ···························· SECCION VENTAS, FACTURACION Y PAGOS ···················································
CREATE TABLE sell (
    id_sell INT PRIMARY KEY AUTO_INCREMENT,
    date_budget_init DATE, -- presupuesto iniciado
    date_budget_finish DATE, -- presupuesto vencimiento
    budget_state INT DEFAULT 0, -- 0 pendiente, 1 aprobado.
    date_sell DATE,
    date_sell_finish DATE,
    sell_state INT DEFAULT 0, -- 0 pendiente - 1 parcial - 2 pagado - 3 presupuesto
    sell_subtotal DECIMAL(10,2),
    sell_discount INT,
    sell_total DECIMAL(10,2),
    paid_state INT,
    id_transaction int
);

CREATE TABLE sell_responsibles (
    id_sell INT,
    id_users INT,
    FOREIGN KEY (id_sell) REFERENCES sell(id_sell),
    FOREIGN KEY (id_users) REFERENCES users(id_users)
);

CREATE TABLE sell_detail (
    id_sell_detail INT PRIMARY KEY AUTO_INCREMENT,
    id_sell INT,
    id_product INT, 
    quantity DECIMAL(10,2), -- cantidad del producto ej 1 o 19,5g
    discount INT,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_product) REFERENCES product(id_product),
    FOREIGN KEY (id_sell) REFERENCES sell(id_sell)
);

CREATE TABLE paid_installment (
    id_installment INT PRIMARY KEY AUTO_INCREMENT, -- cuota
    installment_number INT, -- numero cuota.
    id_sell INT,
    amount_installment DECIMAL(10,2),
    date_paid DATE,
    date_due DATE,
    installment_state BOOLEAN, -- 0 deuda, 1 pagado
    FOREIGN KEY (id_sell) REFERENCES sell(id_sell)
); 

CREATE TABLE paid_category (
    id_paid_category INT PRIMARY KEY AUTO_INCREMENT,
    paid_category_name VARCHAR(20) NOT NULL,
    paid_description VARCHAR(200),
    paid_number_count INT
);


CREATE TABLE paid_detail (
    id_paid_detail INT PRIMARY KEY AUTO_INCREMENT,
    id_installment INT,
    id_paid_category INT,
    date_paid DATE,
    paid_mount DECIMAL(10,2),
    FOREIGN KEY (id_installment) REFERENCES paid_installment(id_installment),
    FOREIGN KEY (id_paid_category) REFERENCES paid_category(id_paid_category)
);

-- Insert de prueba para tablas de ventas y pagos

-- Insertar venta
INSERT INTO sell 
(date_budget_init, date_budget_finish, budget_state, date_sell, date_sell_finish, sell_state, sell_subtotal, sell_discount, sell_total, paid_state)
VALUES
('2023-12-01', '2023-12-05', 1, '2023-12-05', '2023-12-06', 2, 150.00, 10, 135.00, 1);

-- Asignar responsable de la venta
INSERT INTO sell_responsibles (id_sell, id_users) VALUES
(1, 1),
(1, 2);

-- Detalles de la venta
INSERT INTO sell_detail (id_sell, id_product, quantity, discount, subtotal) VALUES
(1, 1, 2.5, 5, 45.00),
(1, 1, 1, 0, 30.00);

-- Insertar cotización pagada
INSERT INTO paid_installment (installment_number, id_sell, amount_installment, date_paid, date_due, installment_state) VALUES
(1, 1, 75, '2023-12-06', '2023-12-15', 1);

-- Categoría de pago
INSERT INTO paid_category (paid_category_name, paid_description, paid_number_count) VALUES
('Efectivo', 'Dinero fisico', 0),
('Transferencia', 'Banco Provincia', 142124);

-- Detalle de pago
INSERT INTO paid_detail (id_installment, id_paid_category, date_paid, paid_mount) VALUES
(1, 1, '2023-12-06', 75.00);


-- OTRA VENTA

INSERT INTO sell 
(date_budget_init, date_budget_finish, budget_state, date_sell, sell_state, sell_subtotal, sell_discount, sell_total, paid_state)
VALUES
('2023-12-01', '2023-12-05', 1, '2023-12-05', 0, 5250.00, 2, 5250.00, 0);

-- Asignar responsable de la venta
INSERT INTO sell_responsibles (id_sell, id_users) VALUES
(2, 1),
(2, 2);

-- Detalles de la venta
INSERT INTO sell_detail (id_sell, id_product, quantity, discount, subtotal) VALUES
(2, 1, 1.00, 0, 5250.00);

-- Insertar cotización pagada
INSERT INTO paid_installment (installment_number, id_sell, amount_installment, date_paid, date_due, installment_state) VALUES
(1, 2, 2625.00, '2023-12-05', '2023-12-15', 1);
INSERT INTO paid_installment (installment_number, id_sell, amount_installment, date_due, installment_state) VALUES
(2, 2, 2625.00, '2024-1-15', 0);

-- Categoría de pago
INSERT INTO paid_category (paid_category_name, paid_description, paid_number_count) VALUES
('Efectivo', 'Dinero fisico', 0),
('Transferencia', 'Banco Provincia', 142124),
('Transferencia', 'Mercado Pago', 124124);

-- Detalle de pago
INSERT INTO paid_detail (id_installment, id_paid_category, date_paid, paid_mount) VALUES
(3, 2, '2023-12-06', 2000.00),
(3, 1, '2023-12-06', 625.00);


-- ##############################################################################################################
-- ·································· STORE PROCEDURES ··························································
-- ·························· Limitados a consultas complejas ···················································

DELIMITER //
-- obtener permisos del usuario por id  example: (CALL GetPermissionsForusers(3);)
-- get iser's permissions for id: (CALL GetPermissionsForusers(3);)
CREATE PROCEDURE GetPermissionsForusers(IN usersId INT)
BEGIN
    SELECT p.permission_name
    FROM users u
    JOIN users_role ur ON u.id_users = ur.id_users
    JOIN role_permissions rp ON ur.id_role = rp.id_role
    JOIN permissions p ON rp.id_permission = p.id_permission
    WHERE u.id_users = usersId;
END //
-- responde Read, Write, Create o Delete
-- response Read, Write, Create or Delete
DELIMITER ;
DELIMITER //
-- obtener usuarios de la empresa
CREATE PROCEDURE getAllCompanyUsers(IN companyId INT)
BEGIN
    Select  users.id_users,
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
    WHERE company_user.id_company = companyId;
END //
-- responde Read, Write, Create o Delete
-- response Read, Write, Create or Delete
DELIMITER ;
DELIMITER //
-- obtener un usuarios de la empresa por ID
CREATE PROCEDURE getCompanyUsersById(IN companyId INT, IN userId INT)
BEGIN
    Select  users.id_users,
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
    WHERE company_user.id_company = companyId
    AND users.id_users = userId;
END //
-- responde 
-- response 
DELIMITER ;
DELIMITER //
-- obtener un usuarios de la empresa por cuit
CREATE PROCEDURE getAllCompanyUsersByCUILCUIT(IN companyId INT, IN userCuil varchar(11), IN userCuit varchar(11))
BEGIN
    Select  users.id_users,
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
    WHERE company_user.id_company = companyId
    AND (users.cuit = userCuil OR
        users.cuil = userCuit)
END //
DELIMITER ;



DELIMITER //
CREATE PROCEDURE GetInstallmentDebt()
BEGIN
    SELECT
        pq.id_installment,
        pq.installment_number,
        pq.amount_installment,
        pq.date_due,
        u.id_users,
        u.nik,
        u.name_users,
        u.lastname,
        r.role_name
    FROM
        paid_installment pq
    JOIN
        sell s ON pq.id_sell = s.id_sell
    JOIN
        sell_responsibles sr ON s.id_sell = sr.id_sell
    JOIN
        users u ON sr.id_users = u.id_users
    JOIN users_role ur on u.id_users = ur.id_users
    JOIN role_permissions rp ON ur.id_role = rp.id_role
    JOIN role r ON rp.id_role = r.id_role
    WHERE
        pq.installment_state = 0 AND r.role_name = "Cliente";
END //
-- responde los id de cuota e id de venta que el cliente no pago
DELIMITER ;

DELIMITER//
-- consulta todos los productos por empresa
CREATE PROCEDURE GetAllProductByCompany(IN companyID INT)
BEGIN
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
    WHERE c.id_company = companyID;
END //
DELIMITER ;
-- ##############################################################################################################

