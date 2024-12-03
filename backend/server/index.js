// HITO 3 BACKEND PROYECTO FINAL
//para el backend
/* para habilitar los cors */
const cors = require("cors");
// Importar express y se ejecuta para obtener un enrutador (app)
const express = require("express");
const app = express();
const usersRoutes = require("../routes/usersRoutes");

// Configuración de CORS para permitir solicitudes con credenciales
const corsOptions = {
  origin: "http://localhost:5173",  // El origen de tu frontend
  credentials: true,  // Permitir enviar cookies o encabezados de autorización
};

app.use(cors(corsOptions)); // se permite cors para todas las rutas

/* parsear el cuerpo de la consulta */
app.use(express.json());

app.use(usersRoutes);

/* Crea un servidor en el puerto 3000  http://localhost:3000 */
app.listen(3000, () => console.log("SERVIDOR ENCENDIDO en el puerto 3000"));
