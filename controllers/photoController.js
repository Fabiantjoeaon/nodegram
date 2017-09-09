const Photo = require('../models/Photo');
const User = require('../models/User');
const uuid = require('uuid');

const create = async (req, res) => {
    req.body.description = req.sanitize(req.body.description);
    const {description, url, username} = req.body;

    const user = await User.findOne({username});
    const photo = new Photo({
        description,
        url,
        uuid: uuid(),
        likes: 0
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
    const photo = await Photo.findOne({uuid: req.params.uuid});
    // const user = await User.findOne({username: req.params.uuid});
    return res.render('photo/show', {
        //TODO: Get user by photo
        title: 'Photo by',
        photo
    })
}  

module.exports = {
    create, 
    show,
    showCreate
}