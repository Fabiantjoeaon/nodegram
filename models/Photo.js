const mongoose = require('mongoose');
const validate = require('validate.js');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const Photo = new Schema(
    {
        author: {
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
        likes: [
            {
                likedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        url: {
            type: String
        },
        comments: [
            {
                text: String,
                postedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        tag: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);

Photo.statics.getInitialConstraints = () => ({});

// Photo.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Photo', Photo);
