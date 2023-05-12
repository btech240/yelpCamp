// Require campground and review models
const Campground = require('../models/campground');
const Review = require('../models/review');

// Route to delete a campground review by pulling a review ID out of the campground
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted campground review.');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review has successfully been posted.');
    res.redirect(`/campgrounds/${campground._id}`);
}