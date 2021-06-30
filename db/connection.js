  
const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        port:3306,
        user: 'root',
        password: 'password',
        database: 'employee_trackerdb'
    }
);

module.exports = db;