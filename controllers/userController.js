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
    //TODO: No find one and update as u need resource here?
    // if (req.body.delete_avatar) {
    //     req.body.avatar = "";
    //     await fs.unlink(path.join(__dirname, `../public/uploads/${stakeholder.avatar}`), () => {});

    //     if(stakeholder.id == req.session.user.id) 
    //         req.session.user.avatar = null;
    // }

    await User.findOneAndUpdate({
        'username': req.params.username
    }, {
        username: req.body.username,
        avatar: req.body.avatar,
        bio: req.body.bio
    });

    req.flash('success', 'Succesfully updated your profile');
    return res.redirect(`/users/${req.params.username}`)
}

module.exports = {
    show,
    showEdit,
    edit
}