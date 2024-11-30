// las funciones HITO 3
const pool = require("../config/config");
const bcrypt = require("bcryptjs"); /// se agrega para encriptado de contraseñas
const jwt = require("jsonwebtoken");
const { findByEmail, createUser } = require("../models/userModel");

//conectar formulario de frontend a la API de backend
// registrar usuario en la base de datos
const registrarUsuario = async (req, res) => {
  const { nombre, password, email } = req.body;
  const passwordEncriptada = bcrypt.hashSync(password); // para encriptar las contraseñas
  try {
    await createUser({
      nombre,
      passwordEncriptada, 
      email,
    });
    return res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Usuario ya existe" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// para verificar credenciales, se valida el email y contraseña
const verificarCredenciales = async (email, password) => {
  //const values = [email
  //const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await findByEmail(email);
  //} = await pool.query(consulta, values);
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
