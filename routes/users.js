const express = require('express');
const router = express.Router();
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

module.exports = router;