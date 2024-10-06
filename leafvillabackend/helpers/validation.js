// Validation for API
// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
log4js.configure('./log.json');
const { check, body } = require('express-validator');
const multer = require('multer');
const path = require('path');
// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.loginValidator = [
	check('username').notEmpty().withMessage('Username is required'),
	check('password').notEmpty().withMessage('Username is required'),
];

exports.villaValidator = [
	check('villaName').notEmpty().withMessage('Villa name is required'),
	check('roomNo').isInt().withMessage('Room number must be an integer'),
	check('guestNo').isInt().withMessage('Guest number must be an integer'),
	check('propertyDescription')
		.notEmpty()
		.withMessage('Property description is required'),
	check('location').notEmpty().withMessage('Location is required'),
	check('petFriendly')
		.isBoolean()
		.withMessage('Pet Friendly must be a boolean'),
	check('privatePool')
		.isBoolean()
		.withMessage('Private Pool must be a boolean'),
	check('privateLawn')
		.isBoolean()
		.withMessage('Private Lawn must be a boolean'),
	check('luxury').isBoolean().withMessage('Luxury must be a boolean'),
	check('isVerified').isBoolean().withMessage('Is Verified must be a boolean'),
	check('amenities').notEmpty().withMessage('Amenities must be an array'),
	check('houseRules').optional(),
	check('policies').optional(),
	check('services').optional().notEmpty().withMessage('Services is required'),
	check('nearbyAttractions').optional(),
];
exports.regionValidator = [
	check('region').notEmpty().withMessage('Region is required'),
];
