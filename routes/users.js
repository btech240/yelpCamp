const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

// Include the user controller
const users = require('../controllers/users');

// Route to register page
router.get('/register', users.renderRegisterForm);

// Route to process user registration
router.post('/register', catchAsync(users.createUser));

// Route to login page
router.get('/login', users.renderLoginForm);

// Route to process user log in
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// Route to log out a user
router.get('/logout', users.logout);

module.exports = router;