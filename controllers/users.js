const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.createUser = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
    }
        req.flash('success', 'You have been logged out');
        res.redirect('/campgrounds');
    });
}