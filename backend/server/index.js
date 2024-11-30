// HITO 3 BACKEND PROYECTO FINAL
/* para habilitar los cors */
const cors = require("cors");
// Importar express y se ejecuta para obtener un enrutador (app)
const express = require("express");
const app = express();

app.use(cors()); // se permite cors para todas las rutas

/* parsear el cuerpo de la consulta */
app.use(express.json());

const usersRoutes = require("../routes/usersRoutes");
/* const { reportarConsulta } = require("../middlewares/authMiddleware"); */
app.use(usersRoutes);

app.use(express.json());
app.use(usersRoutes);
/* app.use(reportarConsulta); */

/* Crea un servidor en el puerto 3000  http://localhost:3000 */
app.listen(3000, () => console.log("SERVIDOR ENCENDIDO en el puerto 3000"));
