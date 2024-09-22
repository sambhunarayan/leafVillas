const mysql = require('mysql2/promise');
const dbConfig = require('./db_config');
const { createPool } = require('generic-pool');

// Create a MySQL connection pool
const pool = createPool({
    create: function () {
        return mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            multipleStatements: true,
            waitForConnections: true,
            connectionLimit: 200,
            queueLimit: 200,
            connectTimeout: 10000

        });
    },
    destroy: function (connection) {
        connection.end();
    }
});
module.exports = pool;