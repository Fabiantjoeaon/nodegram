const User = require('../models/User');
const getUpdatedFields = require('../helpers/getUpdatedFields');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const show = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username}).populate('userPhotos');
    
    return res.render('user/profile', {
        title: `${resourceUser.username}`,
        resourceUser: resourceUser
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const showEdit = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username});

    return res.render('user/edit', {
        title: `edit`,
        resourceUser: resourceUser
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
    return res.redirect(`/users/${req.params.username}`);
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const follow = async (req, res) => {
    const userToFollow = await User.findOne({
        username: req.params.username
    });
    const userFollowing = await User.findOne({
        username: req.user.username
    });
    
    if(userToFollow.followers
        .some(user => String(user._id) == String(userFollowing._id))) {
            req.flash('error', `You are already following ${req.params.username}!`)
            return res.redirect('back');
    }

    userToFollow.followers.push({_id: userFollowing._id});
    userFollowing.following.push({_id: userToFollow._id});
    await userToFollow.save();
    await userFollowing.save();

    req.flash('success', `You are now following ${req.params.username}!`)
    return res.redirect(`/users/${req.params.username}`);
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const unfollow = async (req, res) => {

}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showFollowers = async (req, res) => {

}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showFollowing = async (req, res) => {

}

module.exports = {
    show,
    showEdit,
    edit,
    follow,
    unfollow,
    showFollowers,
    showFollowing
}