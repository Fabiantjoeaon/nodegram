const User = require('../models/User');
const getUpdatedFields = require('../helpers/getUpdatedFields');

const show = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username});
    
    return res.render('user/profile', {
        title: `${resourceUser.username}`,
        resourceUser: resourceUser
    });
}

const showEdit = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username});

    return res.render('user/edit', {
        title: `edit`,
        resourceUser: resourceUser
    });
}

const edit = async (req, res) => {

}

module.exports = {
    show,
    showEdit
}