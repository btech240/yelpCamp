const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const { storeReturnTo } = require('../middleware');

// Include the user controller
const users = require('../controllers/users');

router.route('/register')
    // Route to register page
    .get(users.renderRegisterForm)
    // Route to process user registration
    .post(catchAsync(users.createUser))

router.route('/login')
    // Route to login page
    .get(users.renderLoginForm)
    // Route to process user log in
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// Route to log out a user
router.get('/logout',users.logout)

module.exports = router;