const express = require('express');
// Require Express router, with params passed
const router = express.Router({ mergeParams: true } ) ;
const { campgroundSchema, reviewSchema } = require('../schemas.js');

// Require our error handling middleware
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

// Require campground and review models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Set middleware JOI validation for reviewSchema
const validateReview = (req, res, next) => {
    // Destructure form data to validate against
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Route to delete a campground review by pulling a review ID out of the campground
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

// Process new review form, validating and saving
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Export this router for use in app.js
module.exports = router;