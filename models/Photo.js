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
    uuid: {
        type: String,
        unique: true,
        index: { unique: true }
    },
    description: {
        type: String
    },
    likes: {
        type: Number
    },
    url: {
        type: String
    },
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});


Photo.statics.getInitialConstraints = () => ({

});


// Photo.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Photo', Photo);