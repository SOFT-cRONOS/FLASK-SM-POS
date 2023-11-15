CREATE DATABASE IF NOT EXISTS flaskpos;

USE flaskpos;

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nik varchar(20) not null,
    nombre varchar(20) not null,
    apellido varchar(20) not null,
    pass varchar(20) not null
);

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre varchar(20) not null,
    apellido varchar(20) not null,
    dni varchar(20)
);

CREATE TABLE item(
    id_item int PRIMARY KEY AUTO_INCREMENT,
    nombre_producto varchar(20),
    detalle varchar(50),
    cantidad int,
    precio_compra decimal (5,2),
    precio_venta decimal (5,2)
);

CREATE TABLE venta (
    id_venta int PRIMARY KEY AUTO_INCREMENT,
    fecha DATE,
    id_usuario int,
    id_cliente int,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE detalle_venta (
    id_detalleventa int PRIMARY KEY AUTO_INCREMENT,
    id_venta int,
    id_item int,
    precio_u decimal (5,2),
    cantidad int,
    FOREIGN KEY (id_venta) REFERENCES venta (id_venta),
    FOREIGN KEY (id_item) REFERENCES item (id_item)
);

INSERT INTO usuario
(nik, nombre, apellido, pass) VALUES
('admin', 'Administrador', 'Administra', '1234');

INSERT INTO cliente
(nombre, apellido, dni) VALUES
('Pedro', 'Argenio', '112341'),
('Ana', 'Ramirez', '24124');

INSERT INTO item 
(nombre_producto, detalle, cantidad, precio_compra, precio_venta) VALUES
('fideo', 'manera', 3, 150, 200);

INSERT INTO venta
(fecha, id_usuario, id_cliente) VALUES
('2023-11-10', 1, 1);

INSERT INTO detalle_venta
(id_venta, id_item, precio_u, cantidad) VALUES
(1, 1, 200, 1),
(1, 1, 200, 1);