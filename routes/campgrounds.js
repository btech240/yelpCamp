const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const  { campgroundSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const { populate } = require('../models/review');

// Show all campgrounds
router.get('/', catchAsync(campgrounds.index));

// New campground form, protect login form with isLoggedIn middleware
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Provide an edit form, loading in the campground with the given ID
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Edit the campground with the given ID, edit route with isLoggedIn middleware
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground));

// Process new campground form, saving it to the database, protect post route with isLoggedIn middleware
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Finds campground by ID and shows details
router.get('/:id', catchAsync(campgrounds.show));

// Deletes campground with the given ID, protect delete route with isLoggedIn middleware
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Export this router for use in app.js
module.exports = router;