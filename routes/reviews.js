const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware'); 
// Require Express router, with params passed
const router = express.Router({ mergeParams: true } ) ;
const { campgroundSchema, reviewSchema } = require('../schemas.js');

// Require the reviews controller
const reviews = require('../controllers/reviews')

// Require our error handling middleware
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

// Require campground and review models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Route to delete a campground review by pulling a review ID out of the campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// Process new review form, validating and saving
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Export this router for use in app.js
module.exports = router;