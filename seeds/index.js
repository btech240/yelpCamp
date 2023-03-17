const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');

// Run connection to mongodb
main().catch((err) => {
    console.log("OH NO ERROR!!");
    console.log(err);
});
// function to await calls to mongodb
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
    console.log("Mongo CONNECTION OPEN!!");
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`, title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
    const c = new Campground({title: 'purple field'});
    await c.save()
}

seedDB().then(() => {
    mongoose.connection.close();
})