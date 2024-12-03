// las funciones HITO 3
const pool = require("../config/config");
const bcrypt = require("bcryptjs"); /// se agrega para encriptado de contraseñas
const jwt = require("jsonwebtoken");

//conectar formulario de frontend a la API de backend
// registrar usuario en la base de datos del backend
const registrarUsuario = async (usuario) => {
  let { nombre, password, email } = usuario;
  // Encriptar la contraseña
  const passwordEncriptada = bcrypt.hashSync(password); // para encriptar las contraseñas
  password = passwordEncriptada;
  const values = [nombre, passwordEncriptada, email];
  const consulta =
    "INSERT INTO usuarios (nombre,password, email) VALUES ($1, $2, $3)"; // se inserta los datos en la tabla usuarios
  await pool.query(consulta, values);
};

// para verificar credenciales, se valida el email y contraseña para el backend
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

// para obtener usuarios con el email decodificado para el backend
const getUsuarios = async (email) => {
  const { rows } = await pool.query(
    "SELECT nombre FROM usuarios WHERE email = $1",
    [email]
  );
  if (!rows.length) throw { code: 404, message: "Usuario no encontrado" };
  return [rows[0]]; // retornar como un array con un unico objeto, esto para que  el frontend pueda acceder
};

//para crear publicacion
// el token contiene el email, se decodifica el token y extrae el email del usuario, consulta la bd para obtner el id (usuario_id) asociado al email
const crearPublicacion = async (req, res) => {
  const { titulo, descripcion, imagen_url, precio } = req.body; // Extraer los datos del cuerpo de la solicitud, datos de la publicacion
  /* const { usuario_id } = req.user; */ // Extraer el usuario_id del token JWT
  /* const { usuario_id } = req.body; */ //cuando se agrega por thunder client
  const { email } = req.user; // Extraer el email del token JWT

  try {
    // Buscar el usuario_id en la base de datos utilizando el email del token
    const userQuery = `SELECT id FROM usuarios WHERE email = $1`; //Buscar el usuario_id en la base de datos utilizando el email del token
    const userResult = await pool.query(userQuery, [email]); //Ejecuta la consulta SQL definida en userQuery utilizando la conexión de la base de datos (pool).
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" }); //Verificar si no se encontró el usuario
    }
    const usuario_id = userResult.rows[0].id; // Obtener el usuario_id

    // Preparar la consulta para insertar la publicación
    const query = `
      INSERT INTO publicaciones (titulo, descripcion, imagen_url, precio, usuario_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [titulo, descripcion, imagen_url, precio, usuario_id];
    const { rows } = await pool.query(query, values); // Ejecutar la consulta SQL
    res.status(201).json(rows[0]); // Retornar la publicación creada
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al crear la publicación en controller" });
  }
};

//para mostrar publicaciones
/* const getPublicaciones = async (email) => {
  const { rows } = await pool.query(
    `SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, p.usuario_id
     FROM publicaciones p
     JOIN usuarios u ON p.usuario_id = u.id
     WHERE u.email = $1`,
    [email]
  );

  if (!rows.length)
    throw { code: 404, message: "No se encontraron publicaciones" };
  return rows; // Retorna todas las publicaciones encontradas
};
 */

// para mostrar las publicaciones
const getPublicaciones = async () => {
  /*  const { rows } = await pool.query(
    `SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre AS publicador
     FROM publicaciones p
     JOIN usuarios u ON p.usuario_id = u.id;
     `);
  if (!rows.length)
    throw { code: 404, message: "No se encontraron publicaciones" };
  return rows; // Retorna todas las publicaciones encontradas */

  try {
    const query = `
      SELECT p.id, p.titulo, p.descripcion, p.imagen_url, p.precio, u.nombre AS publicador
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id;
    `;
    const { rows } = await pool.query(query);
    return rows; // Debes retornar los datos para ser utilizados por el router
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener las publicaciones en controllers" });
  }
};

/* const obtenerDetallePublicacion = async (req, res) => {
  try {
    // Extraer el email del token JWT
    const { email } = req.user;
    // Buscar el usuario en la base de datos usando el email
    const userQuery = `SELECT id FROM usuarios WHERE email = $1`;
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const usuario_id = userResult.rows[0].id;
    // Obtener el ID de la publicación desde los parámetros de la solicitud
    const { idPublicacion } = req.params;
    // Obtener los detalles de la publicación, incluyendo el email del publicador
    const result = await pool.query(
      `SELECT p.*, u.email AS publicador_email
       FROM publicaciones p
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id = $1 AND u.id = $2`,
      [idPublicacion, usuario_id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Publicación no encontrada o no pertenece al usuario" });
    }
    const publicacion = result.rows[0];
    // Retornar los detalles de la publicación
    res.json({
      imagen_url: publicacion.imagen_url,
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion,
      precio: publicacion.precio,
      publicador_email: publicacion.publicador_email,
    });
  } catch (error) {
    console.error("Error obteniendo detalle de la publicación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}; */


/* const EliminarPublicacion = ({ idPublicacion }) => {
  const handleEliminar = async () => {
    try {
      // Realizamos la solicitud DELETE al backend
      const response = await axios.delete(`http://localhost:3000/publicaciones/${idPublicacion}`);
      alert(response.data.message); // Mensaje de éxito
    } catch (error) {
      console.error('Error al eliminar la publicación', error);
      alert('No se pudo eliminar la publicación');
    }
  };
}; */

module.exports = {
  registrarUsuario,
  verificarCredenciales,
  getUsuarios,
  crearPublicacion,
  getPublicaciones,
  /* obtenerDetallePublicacion, */
  /* EliminarPublicacion */
};
