// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
const errorLog = log4js.getLogger('error');
const jwt = require('jsonwebtoken');
const config = process.env;

const verifyToken = async (req, res, next) => {
	// Get token from header
	const token =
		req.body.token || req.query.token || req.headers['authorization'];
	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access denied. No token provided.' });
	}
	try {
		const bearer = token.split(' ');
		const bearerToken = bearer[1];
		const decodedData = jwt.verify(bearerToken, config.ACCESS_TOKEN);
		req.user = decodedData;
	} catch (error) {
		return res.status(401).json({ message: 'Invalid token' });
		r;
	}
	return next();
};

module.exports = { verifyToken };
