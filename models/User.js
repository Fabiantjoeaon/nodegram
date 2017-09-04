'use strict';

const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: 'Please supply a username'
    }
});

User.plugin(mongodbErrorHandler);

module.exports = mongoose.Model('User', User);