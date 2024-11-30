const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const Authorization = req.header("Authorization");
  if (!Authorization) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = Authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // REQUERIMIENTO 3 VERIFCAR Y DECODIFICAR
    jwt.verify(token, "mi_clave"); // verificar el token con la misma clave con metodo verify, para la firma
    const payload = jwt.decode(token); // decodificar el token para obtener el email
    req.user = payload; // asignar el payload a req.user
    console.log(`Acceso autorizado para ${payload.email}`);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Token inválido" });
  }
};

module.exports = { authMiddleware };