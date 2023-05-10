const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');

// Verify user is authenticated to use the system
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
    }
    next();
};

// Set middleware Joi validation for campgroundSchema
module.exports.validateCampground = (req, res, next) => {
    // Destructure form data to validate against
    const { error } = campgroundSchema.validate(req.body);
    // If an error is found, map over the details to make a single string message before
    // passing it as a new ExpressError
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Verify user trying to take action on a campground is authorized to
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission on this campground.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// On log in, redirect user to the page they were on
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Set middleware JOI validation for reviewSchema
module.exports.validateReview = (req, res, next) => {
    // Destructure form data to validate against
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}