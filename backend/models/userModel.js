const pool = require("../config/config");

const findByEmail = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1;";
  const values = [email];
  const { rows: user } = await pool.query(consulta, values);
  return user;
};

const createUser = async ({ nombre, passwordEncriptada, email }) => {
  const query =
    "INSERT INTO usuarios (nombre, password, email) VALUES ($1, $2, $3) RETURNING *"; // se inserta los datos en la tabla usuarios
  const values = [nombre, passwordEncriptada, email];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { findByEmail, createUser };
