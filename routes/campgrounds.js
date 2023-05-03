const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const  { campgroundSchema, reviewSchema } = require('../schemas.js');
const {isLoggedIn} = require('../middleware.js');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');


// Set middleware Joi validation for campgroundSchema
const validateCampground = (req, res, next) => {
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

// Show all campgrounds
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

// New campground form, protect login form with isLoggedIn middleware
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// Provide an edit form, loading in the campground with the given ID
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Campground was not found.');
        return res.redirect('/campgrounds');
    }    
    res.render('campgrounds/edit', { campground });
}));

// Edit the campground with the given ID, edit route with isLoggedIn middleware
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Process new campground form, saving it to the database, protect post route with isLoggedIn middleware
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Finds campground by ID and shows details
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Campground was not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}));

// Deletes campground with the given ID, protect delete route with isLoggedIn middleware
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}));

// Export this router for use in app.js
module.exports = router;