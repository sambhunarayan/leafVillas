// Configure log4js for logging
var log4js = require('log4js');

// Create a logger for the indexController
var log = log4js.getLogger('indexController');

// Create a logger specifically for errors
const errorLog = log4js.getLogger('error');

// Load the log configuration from an external file (log.json)
log4js.configure('./log.json');

// Import utility functions from utils module (e.g., helper functions, constants)
const utils = require('../config/utils');

// Import indexModel, which presumably interacts with the database
const models = require('../models/indexModel');

// Initialize the models object for database operations
const indexModels = new models();

// Import express-validator to validate incoming request fields
const { validationResult } = require('express-validator');

// File path handling (used for dealing with file upload paths)
const path = require('path');

// Import sharp for image compression/manipulation (used for optimizing images)
const sharp = require('sharp');

// File system module to handle reading/writing files
const fs = require('fs');

// Import jsonwebtoken module for handling JWT tokens (used for user authentication/authorization)
const jwt = require('jsonwebtoken');

// generate token start
const generateAccessToken = async user => {
	try {
		const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
			expiresIn: '10h',
		});
		return token;
	} catch (error) {
		errorLog.error('Error generating access token', error);
		throw error;
	}
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
	log.info('indexController:login GET method');
	let username, password;
	try {
		username = req.body.username;
		password = req.body.password;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		password = utils.hashPassword(password);
		const login = await indexModels.login(username, password);
		//generate accesstoken
		const accessToken = await generateAccessToken({ user: login });
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
	log.info('indexController:Add villa post  method');
	let villaName,
		regionId,
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
		nearbyAttractions;
	const processedFiles = [];
	const errors = validationResult(req);

	try {
		villaName = req.body.villaName;
		regionId = req.body.regionId;
		roomNo = req.body.roomNo;
		guestNo = req.body.guestNo;
		propertyDescription = req.body.propertyDescription;
		location = req.body.location;
		petFriendly = req.body.petFriendly;
		privatePool = req.body.privatePool;
		privateLawn = req.body.privateLawn;
		luxury = req.body.luxury;
		isVerified = req.body.isVerified;
		amenities = req.body.amenities;
		houseRules = req.body.houseRules;
		policies = req.body.policies;
		services = req.body.services;
		nearbyAttractions = req.body.nearbyAttractions;

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		if (!req.files || req.files.length === 0) {
			return res.status(200).json({
				success: false,
				msg: 'No files were uploaded or only JPEG  are allowed.',
			});
		}

		for (const file of req.files) {
			// Get the path of the uploaded file
			const uploadedFilePath = path.join(
				__dirname,
				'../public/uploads/images',
				file.filename,
			);

			// Define output path for the JPEG image
			const jpegFileName = 'lf' + Date.now() + '.jpeg';
			const outputPath = path.join(
				__dirname,
				'../public/uploads/images',
				jpegFileName,
			);

			// Use sharp to resize the image and convert it to JPEG format with target size
			let imageBuffer = await sharp(uploadedFilePath)
				.resize(200) // Resize to 200px width while maintaining aspect ratio
				.toFormat('jpeg', { quality: 80 }) // Adjust quality to compress (start with 80)
				.toBuffer();

			// Check the file size and adjust quality iteratively
			let quality = 80;
			while (imageBuffer.length > 100 * 1024 && quality > 20) {
				// 100KB = 100 * 1024 bytes
				quality -= 10; // Reduce quality if size exceeds 100KB
				imageBuffer = await sharp(uploadedFilePath)
					.resize(200)
					.toFormat('jpeg', { quality })
					.toBuffer();
			}

			// Save the final compressed JPEG file
			await sharp(imageBuffer).toFile(outputPath);

			// Remove the original file if you only want to keep the JPEG version (optional)
			fs.unlinkSync(uploadedFilePath);

			// Add the processed file details to the array
			processedFiles.push({
				fileName: jpegFileName,
				url: '../public/uploads/images' + jpegFileName,
			});
		}
		const data = await indexModels.insertVilla(
			villaName,
			regionId,
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
		// insert images to database
		for (const image of processedFiles) {
			const fileUpload = await indexModels.insertVillaImages(
				image.fileName,
				data.insertId,
			);
		}
		return res.status(200).json({
			success: true,
			msg: 'Villa added Successfully',
			data: {
				villaName: villaName,
				regionId: regionId,
				roomNo: roomNo,
				guestNo: guestNo,
				propertyDescription: propertyDescription,
				location: location,
				petFriendly: petFriendly,
				privatePool: privatePool,
				privateLawn: privateLawn,
				luxury: luxury,
				isVerified: isVerified,
				amenities: amenities,
				houseRules: houseRules,
				policies: policies,
				services: services,
				nearbyAttractions: nearbyAttractions,
				images: processedFiles,
			},
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
	log.info('indexController: list villa get method');
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
	log.info('indexController: Search villa get method');
	let { page, limit, villa } = req.query;
	let offset, total, totalPages;
	try {
		// Check if tenantId exists
		if (!villa) {
			return res
				.status(400)
				.json({ success: false, msg: 'Villa name is missing' });
		}
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
	log.info('indexController:Add region post  method');
	log.info('req', req);
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
	log.info('indexController: list villa by limits get method');
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
exports.getRegion = async (req, res) => {
	log.info('indexController: list villa get method');

	try {
		const data = await indexModels.fetchRegion();
		// Respond with data, page info, and total count for pagination
		return res.status(200).json({
			success: true,
			msg: 'Regions fetched successfully',
			data: data,
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
	log.info('indexController: Add banner image post method');
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
			'../public/uploads/images',
			req.file.filename,
		);
		const uploadName = 'lf' + Date.now() + '.jpeg';
		const outputPath = path.join(
			__dirname,
			'../public/uploads/images',
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
	log.info('indexController: list banner image get method');

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
