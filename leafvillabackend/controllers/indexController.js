// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
const errorLog = log4js.getLogger('error');
log4js.configure('./log.json');
const utils = require('../config/utils');
const models = require('../models/indexModel');
const indexModels = new models();
// Module to validate fields
const { validationResult } = require('express-validator');
// File upload
const path = require('path');
// JWT token module
const jwt = require('jsonwebtoken');
// generate token start
const gnerateAccessToken = async user => {
	const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '2h' });
	return token;
};
// get featured villa list
exports.index = async (req, res) => {
	try {
		const featuredVillaList = await indexModels.getFeaturedVillaList();
		return res.status(200).json({
			success: true,
			msg: 'List Fetched Successfully',
			data: featuredVillaList,
			// accessToken: accessToken,
			// tokenType: 'Bearer',
		});
	} catch (error) {
		log.error('An error occured', error);
		return res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};

// get login
exports.login = async (req, res) => {
	let username, password;
	try {
		username = req.body.username;
		password = req.body.password;
		password = utils.hashPassword(password);
		const [login] = await indexModels.login(username, password);
		//generate accesstoken
		const accessToken = await gnerateAccessToken({ user: login });
		if (login.length == 0) {
			return res.status(200).json({
				success: true,
				msg: 'Incorrect Login Credentials',
				data: login,
			});
		} else
			return res.status(200).json({
				success: true,
				msg: 'Logged in successfully',
				data: login,
				tokenType: 'Bearer',
				accessToken: accessToken,
			});
	} catch (error) {
		log.error('An error occured', error);
		return res.status(400).json({
			success: false,
			msg: error.message,
		});
	}
};
// add villa post method
exports.postVilla = async (req, res) => {
	log.info('Index controller:Add villa post  method');
	const {
		villaName,
		roomNo,
		guestNo,
		propertyDescription,
		location,
		petFriendly,
		privatePool,
		privateLawn,
		luxury,
		isVerified,
		amenities,
		houseRules,
		policies,
		services,
		nearbyAttractions,
	} = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const data = await indexModels.insertVilla(
			villaName,
			roomNo,
			guestNo,
			propertyDescription,
			location,
			petFriendly,
			privatePool,
			privateLawn,
			luxury,
			isVerified,
			amenities,
			houseRules,
			policies,
			services,
			nearbyAttractions,
		);
		return res.status(200).json({
			success: true,
			msg: 'Villa added Successfully',
			data: data,
		});
	} catch (error) {
		errorLog.error('Error in post villa method', error);
		return res.status(500).json({
			success: false,
			msg: 'Server Error',
			error: error.message,
		});
	}
};
// get villa by limits
exports.getVillaByLimits = async (req, res) => {
	log.info('Index controller: list villa get method');
	let { page } = req.params;
	let { limit } = req.query;
	let offset, total, totalPages;
	try {
		// Validate and sanitize pagination inputs
		page = Math.max(1, parseInt(page, 10) || 1); // Default page is 1, ensure page is >= 1
		limit = Math.max(1, parseInt(limit, 10) || 10); // Default limit is 10, ensure limit is >= 1
		offset = (page - 1) * limit;
		// Fetch total count for pagination
		const countData = await indexModels.fetchVillaCount();
		total = countData[0].count;
		totalPages = Math.ceil(total / limit);
		// Fetch the data based on limit and offset
		const data = await indexModels.fetchVillaByLimit(limit, offset);
		// Respond with data, page info, and total count for pagination
		return res.status(200).json({
			success: true,
			msg: 'Villa fetched successfully',
			data: {
				page,
				totalPages,
				totalItems: total,
				villas: data,
			},
		});
	} catch (error) {
		errorLog.error('Error in listing villa get method', error);
		return res.status(500).json({
			success: false,
			msg: 'Internal Server Error',
		});
	}
};
// search villa
exports.searchVilla = async (req, res) => {
	log.info('Index controller: Search villa get method');
	let { page, limit, villa } = req.query;
	let offset, total, totalPages;
	try {
		// Check if tenantId exists
		if (!villa) {
			return res
				.status(400)
				.json({ success: false, msg: 'Villa name is missing' });
		}
		console.log('villa', req);
		villa = '%' + villa + '%';
		// Validate and sanitize pagination inputs
		page = Math.max(1, parseInt(page, 10) || 1); // Default page is 1, ensure page is >= 1
		limit = Math.max(1, parseInt(limit, 10) || 10); // Default limit is 10, ensure limit is >= 1
		offset = (page - 1) * limit;
		// Fetch total count for pagination
		const countData = await indexModels.searchVillaCount(villa);
		total = countData[0].count;
		totalPages = Math.ceil(total / limit);
		// Fetch the data based on limit and offset
		const data = await indexModels.searchVillaByLimit(villa, limit, offset);
		// Respond with data, page info, and total count for pagination
		return res.status(200).json({
			success: true,
			msg: 'Villa fetched successfully',
			data: {
				page,
				totalPages,
				totalItems: total,
				villas: data,
			},
		});
	} catch (error) {
		errorLog.error('Error  searching villa get method', error);
		return res.status(500).json({
			success: false,
			msg: 'Internal Server Error',
		});
	}
};
// add region post method
exports.postRegion = async (req, res) => {
	log.info('Index controller:Add region post  method');
	const { region } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const data = await indexModels.insertRegion(region);
		return res.status(200).json({
			success: true,
			msg: 'Region added Successfully',
			data: data,
		});
	} catch (error) {
		errorLog.error('Error in post region method', error);
		return res.status(500).json({
			success: false,
			msg: 'Server Error',
			error: error.message,
		});
	}
};
// get region by limits
exports.getRegionByLimits = async (req, res) => {
	log.info('Index controller: list villa get method');
	let { page } = req.params;
	let { limit } = req.query;
	let offset, total, totalPages;
	try {
		// Validate and sanitize pagination inputs
		page = Math.max(1, parseInt(page, 10) || 1); // Default page is 1, ensure page is >= 1
		limit = Math.max(1, parseInt(limit, 10) || 10); // Default limit is 10, ensure limit is >= 1
		offset = (page - 1) * limit;
		// Fetch total count for pagination
		const countData = await indexModels.fetchRegionCount();
		total = countData[0].count;
		totalPages = Math.ceil(total / limit);
		// Fetch the data based on limit and offset
		const data = await indexModels.fetchRegionByLimit(limit, offset);
		// Respond with data, page info, and total count for pagination
		return res.status(200).json({
			success: true,
			msg: 'Regions fetched successfully',
			data: {
				page,
				totalPages,
				totalItems: total,
				regions: data,
			},
		});
	} catch (error) {
		errorLog.error('Error in listing villa get method', error);
		return res.status(500).json({
			success: false,
			msg: 'Internal Server Error',
		});
	}
};
// add banner image post method
exports.postbannerImage = async (req, res) => {
	log.info('Index controller: Add banner image post method');
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Check if a file was uploaded
		if (!req.file) {
			return res.status(400).json({
				success: false,
				msg: 'No file uploaded. Only JPEG images are allowed.',
			});
		}

		// Define file paths
		const uploadedFilePath = path.join(
			__dirname,
			'../public/uploads/bannerImages',
			req.file.filename,
		);
		const uploadName = 'bannerImg' + Date.now() + '.jpeg';
		const outputPath = path.join(
			__dirname,
			'../public/uploads/bannerImages',
			uploadName,
		);

		// Insert into the database
		const data = await indexModels.insertBannerImage(uploadName);

		return res.status(200).json({
			success: true,
			msg: 'Banner image added successfully',
			data: data,
		});
	} catch (error) {
		errorLog.error('Error in post banner image method', error);
		return res.status(500).json({
			success: false,
			msg: 'Server Error',
			error: error.message,
		});
	}
};
// list banner image get method
exports.getBannerImage = async (req, res) => {
	log.info('Index controller: list banner image get method');

	try {
		const data = await indexModels.fetchBannerImage();
		data.forEach(data => {
			data.url = process.env.BANNER_IMAGE_URL + data.bannerImage;
		});
		return res.status(200).json({
			success: true,
			msg: 'Banner image fetched successfully',
			data: data,
		});
	} catch (error) {
		errorLog.error('Error in banner image get method', error);
		return res.status(500).json({
			success: false,
			msg: 'Internal Server Error',
		});
	}
};
