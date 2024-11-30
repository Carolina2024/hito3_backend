// las funciones HITO 3
const pool = require("../config/config");
const bcrypt = require("bcryptjs");/// se agrega para encriptado de contraseñas
/* const jwt = require("jsonwebtoken"); */

//conectar formulario de frontend a la API de backend
// registrar usuario en la base de datos
const registrarUsuario = async (usuario) => {
  let { nombre, password, email } = usuario;
  // Encriptar la contraseña
  const passwordEncriptada = bcrypt.hashSync(password); // para encriptar las contraseñas
  password = passwordEncriptada;
  const values = [nombre, passwordEncriptada, email];
  const consulta =
    "INSERT INTO usuarios (nombre,password, email) VALUES ($1, $2, $3)";  // se inserta los datos en la tabla usuarios
  await pool.query(consulta, values);
};

module.exports = {
  registrarUsuario,
};