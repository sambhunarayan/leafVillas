// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
log4js.configure('./log.json');
const crypto = require('crypto');
function hashPassword(password) {
	// Create a SHA-256 hash object
	const hash = crypto.createHash('sha256');
	// Update the hash object with the password
	hash.update(password);
	// Get the hashed password as a hexadecimal string
	const hashedPassword = hash.digest('hex');
	return hashedPassword;
}
const utils = {
	hashPassword,
};
module.exports = utils;
