const Photo = require('../models/Photo');
const User = require('../models/User');
const Tag = require('../models/Tag');

const index = async (req, res) => {
    const photos = await Photo.find({
        description: {
            $in: [new RegExp(
                req.query.search,
                'i'
            )]
        }
    })
    .populate([
        'author',
        {path: 'tag', select: 'name color'}
    ]);

    return res.render('photo/index', {
        title: 'All users',
        photos,
        url: '?'
    });
}

const create = async (req, res) => {
    req.body.description = req.sanitize(req.body.description);
    if(req.body.tagName)
        req.body.tagName = req.sanitize(req.body.tagName);

    const {tag, description, url} = req.body;

    const user = await User.findOne({
        username: {
            $in: [req.user.username]
        }
    });

    let tagInstance;
    if(tag === 'new-tag') {
        const existingTag = await Tag.findOne({
            name: {
                $in: [req.body.tagName]
            }
        });

        if(existingTag) {
            req.flash('error', 'This tag already exists');
            return res.redirect('back');
        }

        tagInstance = new Tag({
            name: req.body.tagName,
            color: req.body.tagColor
        });
    } else {
        tagInstance = await Tag.findOne({
            name: {
                $in: [tag]
            }
        });
    }

    const photo = new Photo({
        author: user._id,
        description,
        url,
        uuid: req.uuid,
        tag: tagInstance._id
    });

    await photo.save();
    user.userPhotos.push(photo);
    await user.save();

    tagInstance.photos.push(photo);
    await tagInstance.save();

    req.flash('success', 'Succesfully uploaded photo!');
    return res.redirect(`/photos/${photo.uuid}`);
}

const showCreate = async (req, res) => {
    const tags = await Tag.find({});

    return res.render('photo/create', {
        tags,
        tagColors: Tag.getPossibleColors(),
        title: 'New photo'  
    })
}

const show = async (req, res) => {
    const photo = await 
        Photo.findOne({
            uuid: {
                $in: [req.params.uuid]
            }
        })
        .populate([
            'comments',
            {path: 'author', select: 'username'},
            {path: 'comments.postedBy', select: 'username avatar'},
            {path: 'tag', select: 'name color'}
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
        .some(likedBy => String(likedBy._id) === String(req.user._id))) {
        req.flash('error', 'You have already liked this photo!');
        return res.redirect('back');
    }

    photo.likes.push({likedBy: req.user._id});
    await photo.save();

    req.flash('success', 'Like!');
    return res.redirect('back');
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
    return res.redirect('back');
}

const destroyComment = async (req, res) => {
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

    photo.comments.pull({_id: req.params.comment_id});
    await photo.save();

    req.flash('success', 'Your comment has been removed!');
    return res.redirect('back');
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
        }).populate('author');
    
    const user = await User.findOne({username: photo.author.username});
    user.userPhotos.pull({_id: photo._id});
    await user.save();

    req.flash('success', 'Your photo has been removed!');
    return res.redirect('back');
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
        Photo.findOne({
            uuid: {
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
    index,
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
