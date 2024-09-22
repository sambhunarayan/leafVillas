// routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index_controller');
// const { loginValidator } = require('../helpers/validation');
// const auth = require('../middlewares/auth');
// session
// const session = require('express-session');
// initialize session
// router.use(
// 	session({
// 		secret: process.env.SESSION_KEY,
// 		saveUninitialized: true,
// 		resave: true,
// 	}),
// );
// load home page
router.get('/', indexController.index);
router.post('/login', indexController.login);

// check user for login post method
// router.post('/login', loginValidator, indexController.login);
// logout get method
// router.get('/logout', indexController.logout);
module.exports = router;