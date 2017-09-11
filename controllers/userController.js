const User = require('../models/User');
const Photo = require('../models/Photo');
const getUpdatedFields = require('../helpers/getUpdatedFields');
const flattenDeep = require('lodash/flattenDeep');
const orderBy = require('lodash/orderBy');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const show = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username}).populate('userPhotos');
    
    if(!resourceUser) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }
    
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
    
    if(!resourceUser) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }

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

    const user = await User.findOneAndUpdate({
        'username': req.params.username
    }, {
        username: req.body.username,
        avatar: req.body.avatar,
        bio: req.body.bio
    });

    if(!user) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }

    req.flash('success', 'Succesfully updated your profile');
    return res.redirect(`/users/${req.body.username}`);
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

    if(!userToFollow || !userFollowing) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }
    
    if(userToFollow.followers
        .some(userId => String(userId) == String(userFollowing._id))) {
            req.flash('error', `You are already following ${req.params.username}!`)
            return res.redirect(`/users/${req.params.username}`);
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
    const userToUnfollow = await User.findOne({
        username: req.params.username
    });
    const userUnfollowing = await User.findOne({
        username: req.user.username
    });

    if(!userToUnfollow || !userUnfollowing) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }
    
    if(!userToUnfollow.followers
        .some(userId => String(userId) == String(userUnfollowing._id))) {
            req.flash('error', `You are not following ${req.params.username}!`)
            return res.redirect(`/users/${req.params.username}`);
    }

    userToUnfollow.followers.pull({_id: userUnfollowing._id});
    userUnfollowing.following.pull({_id: userToUnfollow._id});
    await userToUnfollow.save();
    await userUnfollowing.save();

    req.flash('success', `You are now unfollowing ${req.params.username}!`)
    return res.redirect(`/users/${req.params.username}`);
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showFollowers = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username})
        .populate('followers');

    if(!resourceUser) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }

    return res.render('user/followers', {
        title: `${resourceUser.username} followers`,
        resourceUser
    });
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showFollowing = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username})
        .populate('following');

    if(!resourceUser) {
        req.flash('error', 'No user found.');
        return res.redirect('/404');
    }

    return res.render('user/following', {
        title: `${resourceUser.username} following`,
        resourceUser
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const renderTimeline = async (req, res) => {
    const user = await User.findOne({'username': req.user.username})
    
    const photos = flattenDeep(await Promise.all(
        Array.from(
            user.following, 
            async id => await Photo.find({author: id})
                                .populate({
                                    path: 'author', 
                                    select: 'username avatar'
                                })
                                .sort({
                                    'createdAt': 'desc'
                                })
        )
    ));

    return res.render('user/timeline', {
        title: 'Your timeline',
        photos: orderBy(photos, photo => photo.createdAt, ['desc'])
    });
}

module.exports = {
    show,
    showEdit,
    edit,
    follow,
    unfollow,
    showFollowers,
    showFollowing,
    renderTimeline
}