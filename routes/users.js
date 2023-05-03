const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');

// Route to register page
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Route to process user registration
router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp');
        res.redirect('/campgrounds');
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register');
    }
}));

// Route to login page
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Route to process user log in
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/campgrounds');
})

module.exports = router;