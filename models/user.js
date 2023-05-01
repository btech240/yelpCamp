const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Require a unique email address, plugin below requires username and password
const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Add a username and password to UserSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongose.model('User', UserSchema);