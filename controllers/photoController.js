const Photo = require('../models/Photo');
const User = require('../models/User');

const create = async (req, res) => {
    req.body.description = req.sanitize(req.body.description);
    const {description, url} = req.body;

    const user = await User.findOne({
        username: {
            $in: [req.user.username]
        }
    });

    const photo = new Photo({
        author: user._id,
        description,
        url,
        uuid: req.uuid
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
        Photo.findOne({uuid: {
                $in: [req.params.uuid]
            }
        })
        .populate([
            'comments',
            {path: 'author', select: 'username'},
            {path: 'comments.postedBy', select: 'username avatar'}
        ]);

    if(!photo) {
        req.flash('error', 'No photo found.');
        return res.redirect('/404');
    }

    return res.render('photo/show', {
        title: 'Photo by',
        photo
    });
}  

const like = async (req, res) => {
    const photo = await 
        Photo.findOne({
            uuid: {
                $in: [req.params.uuid]
            }
            }).populate('author');
    
    if(!photo) {
        req.flash('error', 'No photo found.');
        return res.redirect('/404');
    }

    if(photo.likes
        .some(likedBy => String(likedBy._id) == String(req.user._id))) {
            req.flash('error', 'You have already liked this photo!');
            return res.redirect('back');
    }

    photo.likes.push({likedBy: req.user._id});
    await photo.save();

    req.flash('success', 'Like!');
    return res.redirect(`back`);
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
        Photo.findOne({
            uuid: {
                    $in: [req.params.uuid]
                }
            });

    if(!photo) {
        req.flash('error', 'No photo found.');
        return res.redirect('/404');
    }

    photo.comments.push({
        text: req.body.text,
        postedBy: req.user._id
    });
    await photo.save();

    req.flash('success', 'Your comment has been posted!');
    return res.redirect(`back`);
}

const destroyComment = async (req, res) => {
    const photo = await 
        Photo.findOne({uuid: {
                $in: [req.params.uuid]
            }
        });
    
    if(!photo) {
        req.flash('error', 'No photo found.');
        return res.redirect('/404');
    }

    photo.comments.pull({_id: req.params.comment_id});
    await photo.save();

    req.flash('success', 'Your comment has been removed!');
    return res.redirect(`back`);
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const destroy = async (req, res) => {
    const photo = await 
        Photo.findOneAndRemove({
            uuid: {
                $in: [req.params.uuid]
            }
        });
    
    if(!photo) {
        req.flash('error', 'No photo found.');
        return res.redirect('/404');
    }
    
    const user = await User.findOne({username: req.user.username});
    user.userPhotos.pull({_id: photo._id});
    await user.save();

    req.flash('success', 'Your photo has been removed!');
    return res.redirect(`/users/${req.user.username}`)
}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showComments = async (req, res) => {

}

/**
*
* @param {Object} req 
* @param {Object} res 
* @returns {}
*/
const showLikes = async (req, res) => {
    const photo = await 
        Photo.findOne({uuid: {
                $in: [req.params.uuid]
            }
        })
        .populate('likes.likedBy');

    if(!photo) {
        req.flash('error', 'No photo found.');
        return res.redirect('/404');
    }
    
    return res.render('photo/likes', {
        title: 'Likes',
        photo
    });
}

module.exports = {
    create, 
    show,
    showCreate,
    like,
    showLikes,
    comment,
    showComments,
    destroy,
    destroyComment
}