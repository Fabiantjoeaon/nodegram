'use strict';

const mongodbErrorHandler = require('mongoose-mongodb-errors');
const mongoose = require('mongoose');
const validate = require('validate.js');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Photo = new Schema({
    userID: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    description: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: { unique: true }
    },
    likes: {
        type: Integer
    },
    url: {
        type: String
    }
});


Photo.statics.getInitialConstraints = () => ({

});


User.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Photo', Photo);