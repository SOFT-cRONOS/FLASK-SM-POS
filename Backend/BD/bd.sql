-- ###########################################################################
-- ######## TERMINOS PREVIOS:                                         ######## 
-- ######## installment = Cuota mensual                               ########
-- ########################################################################### 

-- CREATE users 'admin'@'%' IDENTIFIED VIA mysql_native_password USING '***';
-- GRANT USAGE ON *.* TO 'admin'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_users_CONNECTIONS 0; 
--  GRANT ALL PRIVILEGES ON `flaskpos`.* TO 'admin'@'%' WITH GRANT OPTION; 
drop database tester;
CREATE DATABASE IF NOT EXISTS tester;

USE tester;

-- Tabla para roles
CREATE TABLE roles (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(15) NOT NULL,
    description_role VARCHAR(50)
);

-- Tabla para permisos
CREATE TABLE permissions (
    id_permission INT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(50) NOT NULL
);

-- Tabla para usuarios
CREATE TABLE userss (
    id_users INT PRIMARY KEY AUTO_INCREMENT,
    nik VARCHAR(20) NOT NULL,
    cuil varchar(11) NOT NULL, -- Alterna con DNI
    cuit varchar(11),
    name_users VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    img VARCHAR(255),
    home_address VARCHAR(30),
    number_address INT(4),
    department VARCHAR(4),
    phone INT,
    email VARCHAR(50) NOT NULL,
    id_role INT,
    status INT(1),
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

-- Tabla para asignar permisos a roles
CREATE TABLE role_permissions (
    id_role INT,
    id_permission INT,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES roles(id_role),
    FOREIGN KEY (id_permission) REFERENCES permissions(id_permission)
);

-- Tabla para asignar roles a usuarios
CREATE TABLE users_roles (
    id_users INT,
    id_role INT,
    PRIMARY KEY (id_users, id_role),
    FOREIGN KEY (id_users) REFERENCES userss(id_users),
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TABLE login_history (
    id_login INT PRIMARY KEY AUTO_INCREMENT,
    users_id INT,
    login_time DATETIME NOT NULL,
    logout_time DATETIME,
    FOREIGN KEY (users_id) REFERENCES userss(id_users)
);

-- Insert de prueba para tablas usuarios y roles

-- Insertar roles
INSERT INTO roles (role_name, description_role) VALUES 
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
INSERT INTO userss (nik, cuil, name_users, lastname, password_hash, img, home_address, number_address, department, phone, email, id_role, status) VALUES
('usuario1','23235412541', 'Juan', 'Pérez', 'contrasena1hash', NULL, 'Calle Principal', 123, 'A', 123456789, 'juan@email.com', 1, 1),
('usuario2','54235412547', 'María', 'Gómez', 'contrasena2hash', NULL, 'Avenida Secundaria', 456, 'B', 987654321, 'maria@email.com', 2, 1),
('admin1','24547623762', 'Admin', 'Master', 'adminpasshash', NULL, 'Calle Admin', 789, 'C', 555555555, 'admin@email.com', 3, 1);

-- Insertar asignación de permisos a roles
INSERT INTO role_permissions (id_role, id_permission) VALUES
(1, 1),
(2, 2),
(3, 1),
(3, 2),
(3, 3);

-- Insertar asignación de roles a usuarios
INSERT INTO users_roles (id_users, id_role) VALUES
(1, 1),
(2, 2),
(3, 3);


-- ##############################################################################################################
-- ·································· STORE PROCEDURES ··························································
-- ·························· Limitados a consultas complejas ···················································
DELIMITER //
-- obtener permisos del usuario por id  example: (CALL GetPermissionsForusers(3);)
-- get iser's permissions for id: (CALL GetPermissionsForusers(3);)
CREATE PROCEDURE GetPermissionsForusers(IN usersId INT)
BEGIN
    SELECT p.permission_name
    FROM userss u
    JOIN users_roles ur ON u.id_users = ur.id_users
    JOIN role_permissions rp ON ur.id_role = rp.id_role
    JOIN permissions p ON rp.id_permission = p.id_permission
    WHERE u.id_users = usersId;
END //
-- responde Read, Write, Create o Delete
-- response Read, Write, Create or Delete
DELIMITER ;


-- ##############################################################################################################
-- ···························· SECCION PRODUCTOS E INVENTARIO ···················································
CREATE TABLE product (
    id_product int PRIMARY KEY AUTO_INCREMENT,
    product varchar(20)
);

INSERT INTO product
(product) VALUES
('Crema'),
('Shampoo'),
('jabon'),
('peine'),
('arroz'),
('Teclado');


-- ##############################################################################################################
-- ···························· SECCION VENTAS, FACTURACION Y PAGOS ···················································
CREATE TABLE sell (
    id_sell INT PRIMARY KEY AUTO_INCREMENT,
    date_budget_init DATE,
    date_budget_finish DATE, 
    budget_state INT DEFAULT 0, -- 0 pendiente, 1 aprobado.
    date_sell DATE,
    date_sell_finish DATE,
    sell_state INT DEFAULT 0, -- 0 pendiente - 1 parcial - 2 pagado - 3 presupuesto
    sell_subtotal DECIMAL(10,2),
    sell_discount INT,
    sell_total DECIMAL(10,2),
    paid_state INT
);

CREATE TABLE sell_responsibles (
    id_sell INT,
    id_users INT,
    FOREIGN KEY (id_sell) REFERENCES sell(id_sell),
    FOREIGN KEY (id_users) REFERENCES userss(id_users)
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
    id_installment INT PRIMARY KEY AUTO_INCREMENT,
    installment_number INT,
    id_sell INT,
    amount_installment DECIMAL(10,2),
    date_paid DATE,
    date_due DATE,
    installment_state BOOLEAN -- 0 deuda, 1 pagado
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
(1, 2, 1, 0, 30.00);

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
(2, 5, 1.00, 0, 5250.00);

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
        userss u ON sr.id_users = u.id_users
    JOIN users_roles ur on u.id_users = ur.id_users
    JOIN role_permissions rp ON ur.id_role = rp.id_role
    JOIN roles r ON rp.id_role = r.id_role
    WHERE
        pq.installment_state = 0 AND r.role_name = "Cliente";
END //
-- responde los id de cuota e id de venta que el cliente no pago
DELIMITER ;



-- ##############################################################################################################

