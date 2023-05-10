const express = require('express');
const { validateReview, isLoggedIn } = require('../middleware'); 
// Require Express router, with params passed
const router = express.Router({ mergeParams: true } ) ;
const { campgroundSchema, reviewSchema } = require('../schemas.js');

// Require our error handling middleware
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

// Require campground and review models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Route to delete a campground review by pulling a review ID out of the campground
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted campground review.');
    res.redirect(`/campgrounds/${id}`);
}));

// Process new review form, validating and saving
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review has successfully been posted.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Export this router for use in app.js
module.exports = router;