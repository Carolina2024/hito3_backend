CREATE DATABASE market;

\c market;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE publicaciones (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen_url VARCHAR(255),
    precio NUMERIC(10, 2) NOT NULL,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    publicacion_id INT NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE
);

CREATE TABLE boletas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE items_boleta (
    id SERIAL PRIMARY KEY,
    boleta_id INT NOT NULL REFERENCES boletas(id) ON DELETE CASCADE,
    publicacion_id INT NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    cantidad_item INT NOT NULL CHECK (cantidad_item > 0)
);






//SELECT * FROM usuarios;
//SELECT * FROM publicaciones;
//SELECT * FROM favoritos;
//ON DELETE CASCADE Si un usuario, publicacion o boleta es eliminado, los registros se eliminan.
//CHECK (cantidad_item > 0) Cantidad de items en una boleta sea positiva.