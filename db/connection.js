const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678Noemi",
  database: "employee_tracker",
});


module.exports = con
