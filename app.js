// Required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const  { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

// Run connection to mongodb
main().catch((err) => {
    console.log("Error Connecting to MongoDB.");
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

// Use express router middleware
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// Home Page - Needs Fixed
app.get('/', (req, res) => {
    res.render('home');
});

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