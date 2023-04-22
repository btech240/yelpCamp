// Required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const  { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const Review = require('./models/review');

// Run connection to mongodb
main().catch((err) => {
    console.log("OH NO ERROR!!");
    console.log(err);
});
// Function to await calls to mongodb
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
    console.log("Mongo CONNECTION OPEN!!");
}

// Set express as app framework
const app = express();

// Set middleware and EJS to handle html
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

// Show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

// New campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Provide an edit form, loading in the campground with the given ID
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// Edit the campground with the given ID
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Process new campground form, saving it to the database
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Finds campground by ID and shows details
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
}));

// Deletes campground with the given ID
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// This call seeds our database with data in the seed folder - comment out unless we need to seed the database
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' });
//     await camp.save();
//     res.send(camp);
// })

// Catch all bad requests and display 404 error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found.', 404));
})

// Error handler, display error message and stacktrace
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong.'
    res.status(statusCode).render('error', { err });
});

// Set node to listen on port 3000
app.listen(3000, () => {
    console.log('SERVER LISTENING...')
})