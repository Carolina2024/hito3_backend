// PARA LA BASE DE DATOS
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "sql7777",
  database: "market",
  allowExitOnIdle: true,
});

module.exports = pool;
