// las rutas HITO 3
const express = require("express");
const {
  registrarUsuario,
  verificarCredenciales,
  getUsuarios,
} = require("../controllers/usersControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ruta para crear usuarios
// localhost:3000/usuarios, se agrega los datos de las 3 columnas de la tabla en body
//POST FUNCIONA BIEN POR THUNDER Y POR FRONTEND
router.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body; // captura los datos
    await registrarUsuario(usuario); // registra el usuario
    res.send("Usuario registrado con éxito"); // respuesta con mensaje
  } catch (error) {
    res.status(500).send(error); // envia un error
  }
});

// ruta para el login
// POST localhost:3000/login con email y password en body se obtiene el token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // captura el email y contraseña
    await verificarCredenciales(email, password); // verifica las credenciales
    //FIRMA DE TOKEN
    const token = jwt.sign({ email }, "mi_clave", { expiresIn: 1200 }); // genera y firma un token JWT con duracion, con payload del email
    res.json({ token }); // envia el token en un objeto JSON
  } catch (error) {
    console.log(error); // imprime el error en la consola
    res.status(error.code || 500).send(error); // envia el error
  }
});

// para obtener datos de usuario con autenticacion
// GET localhost:3000/usuarios  con autorizacion de token, se escribe en Headers con Bearer
router.get("/usuarios", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user; // obtener email del token verificado por el middleware
    const user = await getUsuarios(email);
    res.status(200).json(user); // enviar datos del usuario
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ message: error.message || "Error en el servidor" });
  }
});

module.exports = router;
