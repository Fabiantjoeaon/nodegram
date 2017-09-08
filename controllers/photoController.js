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
        uuid: uuid()
    });

    await photo.save();
    user.userPhotos.push(photo);
    await user.save();

    req.flash('success', 'Succesfully uploaded photo!');
    //TODO: Link to photo
    return res.redirect(`/users/${username}`);
}

const showCreate = (req, res) => {
    return res.render('photo/create', {
        title: 'New photo'
    })
}

const show = async (req, res) => {

}

module.exports = {
    create, 
    show,
    showCreate
}