'use strict';

const {encrypt, isHashMatching} = require('../helpers/hashing');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const mongoose = require('mongoose');
const validate = require('validate.js');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: { unique: true }
    },
    password: { 
        type: String
    },
    bio: {
        type: String
    },
    isAdmin: {
        type: Boolean
    },
    avatar: {
        type: String
    },
    userPhotos: [{
        type: Schema.Types.ObjectId,
        ref: 'Photo'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

User.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const hash = await encrypt(this.password);    
    this.password = hash;

    next();
});

User.statics.getInitialConstraints = () => ({
    username: {
        presence: true,
        length: {
            minimum: 2,
            maximum: 15,
            message: 'must be between 2 and 15 characters'
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 4,
            message: 'must be at least 4 characters'
        }
    }
});

User.methods.comparePassword = async function(candidatePassword) {
    return await isHashMatching(candidatePassword, this.password);
} 

User.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', User);