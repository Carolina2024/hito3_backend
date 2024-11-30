// las funciones HITO 3
const pool = require("../config/config");
const bcrypt = require("bcryptjs");/// se agrega para encriptado de contraseñas
const jwt = require("jsonwebtoken");

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

// para verificar credenciales, se valida el email y contraseña
const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada); // compara la constraseña encriptada con bcrypt para autenticacion
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
  return usuario;
};

// para obtener usuarios con el email decodificado
const getUsuarios = async (email) => {
  const { rows } = await pool.query(
    "SELECT email, rol, lenguage FROM usuarios WHERE email = $1",
    [email]
  );
  if (!rows.length) throw { code: 404, message: "Usuario no encontrado" };
  return [rows[0]]; // retornar como un array con un unico objeto, esto para que  el frontend pueda acceder
};

module.exports = { registrarUsuario, verificarCredenciales, getUsuarios };



