'use strict';

const bcrypt = require('bcrypt');
const {encrypt, isHashMatching} = require('../helpers/hashing');
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
        required: 'Please supply a username',
        index: { unique: true }
    },
    password: { type: String, required: true }
});

User.pre('save', async (next) => {
    if (!user.isModified('password')) return next();

    const hash = await encrypt(this.password);
    this.password = hash;

    next();
});

User.methods.comparePassword = async (candidatePassword) => 
    await isHashMatching(candidatePassword, this.password);

User.plugin(mongodbErrorHandler);

module.exports = mongoose.Model('User', User);