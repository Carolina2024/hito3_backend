// las rutas HITO 3
const express = require("express");
const { registrarUsuario } = require("../controllers/usersControllers");
/* const { authMiddleware } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken"); */

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

module.exports = router;
