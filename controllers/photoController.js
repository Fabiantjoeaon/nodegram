const Photo = require('../models/Photo');
const User = require('../models/User');
const uuid = require('uuid');

const create = async (req, res) => {
    req.body.description = req.sanitize(req.body.description);
    const {description, url} = req.body;

    const user = await User.findOne({username: req.user.username});

    const photo = new Photo({
        author: user._id,
        description,
        url,
        uuid: uuid()
    });

    await photo.save();
    user.userPhotos.push(photo);
    await user.save();

    req.flash('success', 'Succesfully uploaded photo!');
    return res.redirect(`/photos/${photo.uuid}`);
}

const showCreate = (req, res) => {
    return res.render('photo/create', {
        title: 'New photo'
    })
}

const show = async (req, res) => {
    const photo = await 
        Photo.findOne({uuid: req.params.uuid})
        .populate([
            'comments',
            {path: 'author', select: 'username'},
            {path: 'comments.postedBy', select: 'username avatar'}
        ]);

    return res.render('photo/show', {
        title: 'Photo by',
        photo
    })
}  

const like = async (req, res) => {
    const photo = await 
        Photo.findOne({uuid: req.params.uuid});
    photo.likes.push({likedBy: req.user._id});
    await photo.save();

    req.flash('success', 'Like!');
    return res.redirect(`/photos/${req.params.uuid}`);
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const comment = async (req, res) => {
    if(!req.body.text) {
        req.flash('error', 'Write something first!');
        return res.redirect('back');
    }
    req.body.text = req.sanitize(req.body.text);

    const photo = await 
        Photo.findOne({uuid: req.params.uuid});
    photo.comments.push({
        text: req.body.text,
        postedBy: req.user._id
    });
    await photo.save();

    req.flash('success', 'Your comment has been posted!');
    return res.redirect(`/photos/${req.params.uuid}`);
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showComments = async (req, res) => {

}

const showLikes = async (req, res) => {

}

module.exports = {
    create, 
    show,
    showCreate,
    like,
    showLikes,
    comment,
    showComments
}