const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const upload = multer({ dest : 'uploads/' });


router.route('/')
    // Show all campgrounds
    .get(catchAsync(campgrounds.index))
    // Process new campground form, saving it to the database, protect post route with isLoggedIn middleware
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
    });

// New campground form, protect login form with isLoggedIn middleware
// New route needs to be placed before the /:id routes or it will think it is /:id/new and create an error
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    // Edit the campground with the given ID, edit route with isLoggedIn middleware
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    // Finds campground by ID and shows details
    .get(catchAsync(campgrounds.show))
    // Deletes campground with the given ID, protect delete route with isLoggedIn middleware
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// Provide an edit form, loading in the campground with the given ID
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Export this router for use in app.js
module.exports = router;