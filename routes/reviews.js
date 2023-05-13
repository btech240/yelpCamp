const express = require('express');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware'); 
// Require Express router, with params passed
const router = express.Router({ mergeParams: true } );
// Require the reviews controller
const reviews = require('../controllers/reviews')
// Require our error handling middleware
const catchAsync = require('../utilities/catchAsync');

// Route to delete a campground review by pulling a review ID out of the campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// Process new review form, validating and saving
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Export this router for use in app.js
module.exports = router;