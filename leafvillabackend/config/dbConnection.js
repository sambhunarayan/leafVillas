// configure log
var log4js = require('log4js');
var log = log4js.getLogger('dbConnection');
log4js.configure('./log.json');
const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');
const { createPool } = require('generic-pool');

// Create a MySQL connection pool
const pool = createPool(
	{
		create: async function () {
			return await mysql.createConnection({
				host: dbConfig.host,
				user: dbConfig.user,
				password: dbConfig.password,
				database: dbConfig.database,
				timezone: dbConfig.timezone,
				multipleStatements: true,
				keepAliveInitialDelay: 10000, // 0 by default.
				enableKeepAlive: true, // false by default.
			});
		},
		destroy: function (connection) {
			return connection.end();
		},
	},
	{
		max: 200, // Maximum number of connections
		min: 2, // Minimum number of connections
		idleTimeoutMillis: 30000, // 30 seconds idle timeout
		acquireTimeoutMillis: 10000, // Wait up to 10 seconds for a connection
	},
);

// Function to check the connection
async function checkConnection() {
	let connection;
	try {
		// Acquire a connection from the pool
		connection = await pool.acquire();

		// Test the connection by running a simple query
		const [rows] = await connection.execute('SELECT 1');
		log.info('Database connection successfull: ', rows);
	} catch (error) {
		log.error('Database connection failed: ', error);
	} finally {
		if (connection) {
			// Release the connection back to the pool
			await pool.release(connection);
		}
	}
}

// Example of checking the connection
checkConnection();

module.exports = pool;
