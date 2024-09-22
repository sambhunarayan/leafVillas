// configure log
var log4js = require('log4js');
var log = log4js.getLogger();
log4js.configure('./log.json');
// const utils = require('../config/utils');
const models = require('../models/index_model');
const indexModels = new models();
// Module to validate fields
const { validationResult } = require('express-validator');
// JWT token module
const jwt = require('jsonwebtoken');


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
        const login = await indexModels.login(username, password);
        if (login.length == 0) {
            return res.status(200).json({
                success: true,
                msg: 'Incorrect Login Credentials',
                data: login,
                // accessToken: accessToken,
                // tokenType: 'Bearer',
            });
        } else
            return res.status(200).json({
                success: true,
                msg: 'Logged In Successfully',
                data: login,
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