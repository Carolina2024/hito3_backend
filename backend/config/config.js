// PARA LA BASE DE DATOS
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "mo76492250",
  database: "market",
  allowExitOnIdle: true,
});

module.exports = pool;
