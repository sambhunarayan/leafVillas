// routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const {
	loginValidator,
	villaValidator,
	regionValidator,
} = require('../helpers/validation');
const auth = require('../middlewares/auth');
// session
const session = require('express-session');
// initialize session
router.use(
	session({
		secret: process.env.SESSION_KEY,
		saveUninitialized: true,
		resave: true,
	}),
);
// File upload
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype === 'image/jpeg') {
			cb(null, path.join(__dirname, '../public/uploads/bannerImages'));
		}
	},
	filename: function (req, file, cb) {
		const name = 'bannerImg' + Date.now();
		cb(null, name);
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
// load home page
router.get('/', indexController.index);
router.post('/login', loginValidator, indexController.login);
// add villa post method
router.post(
	'/villa',
	auth.verifyToken,
	villaValidator,
	indexController.postVilla,
);
// list villa get method
router.get('/villa/:page', auth.verifyToken, indexController.getVillaByLimits);
// search villa get method
router.get('/searchVilla', auth.verifyToken, indexController.searchVilla);
// add region post method
router.post(
	'/region',
	auth.verifyToken,
	regionValidator,
	indexController.postRegion,
);
// list region post method
router.get(
	'/region/:page',
	auth.verifyToken,
	indexController.getRegionByLimits,
);
// add banner image  post method
router.post(
	'/bannerImage',
	auth.verifyToken,
	upload.single('image'),
	indexController.postbannerImage,
);
// add banner image  post method
router.get('/bannerImage', auth.verifyToken, indexController.getBannerImage);
module.exports = router;
