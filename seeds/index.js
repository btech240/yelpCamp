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
    for(let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 25) + 11;
        const camp = new Campground({
            author: '6454f0e280c694d32da6e487', // Your user ID
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                url: 'https://res.cloudinary.com/dfko0wkfb/image/upload/v1684443939/YelpCamp/kkxoxggfx6hkwxv7tzsi.jpg',
                filename: 'YelpCamp/kkxoxggfx6hkwxv7tzsi',
                },
                {
                url: 'https://res.cloudinary.com/dfko0wkfb/image/upload/v1684443939/YelpCamp/g71uz4jl6vkzmziey2xt.jpg',
                filename: 'YelpCamp/g71uz4jl6vkzmziey2xt',
                }
            ],
            description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
            price: price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})