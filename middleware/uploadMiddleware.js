const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {newDateNow} = require('../helpers/dateHelper');
const {getMonth, getYear} = require('date-fns');
const uuid = require('uuid');
const jimp = require('jimp');

/**
 * Created new year and month based dirs and writes file to these dirs
 * @param {*} file 
 * @returns {String} Full file path
 */
const write = async (file, name) => {
    const date = newDateNow();

    const yearPath = path.resolve(`./public/uploads/${getYear(date)}`);
    if(!fs.existsSync(yearPath)) {
        fs.mkdirSync(yearPath);
    }

    const monthPath = `${yearPath}/${getMonth(date)}`;
    if(!fs.existsSync(monthPath)) {
        fs.mkdirSync(monthPath);
    }

    await file.write(`${monthPath}/${name}`); 
    return `${getYear(date)}/${getMonth(date)}/${name}`;
}

const filter = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image');
        
        if(isPhoto) {
            next(null, true);
        } else {
            next(new Error('That filetype is not allowed!'), false);
        }
    }
}

const filterAvatar = multer({
    filter
}).single('avatar');

const filterPhoto = multer({
    filter
}).single('photo');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const resizeAndWritePhoto = async (req, res, next) => {
    if(!req.file) 
        return next();
    
    const extension = req.file.mimetype.split('/')[1];
    const name = `${uuid.v4()}.${extension}`;

    let photo;
    if(extension == 'gif') {
        req.flash('error', 'That filetype is not supported!');
        return res.redirect('back');
    } else {
        photo = await jimp.read(req.file.buffer);
        await photo.resize(parseInt(process.env.RESIZE_AVATAR_SIZE), jimp.AUTO);
    }

    req.body.url = await write(photo, name);

    next();
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const resizeAndWriteAvatar = async (req, res, next) => {
    if(!req.file) 
        return next();
    
    const extension = req.file.mimetype.split('/')[1];
    const name = `${uuid.v4()}.${extension}`;

    let photo;
    if(extension == 'gif') {
        req.flash('error', 'That filetype is not supported!');
        return res.redirect('back');
    } else {
        photo = await jimp.read(req.file.buffer);
        await photo.resize(parseInt(process.env.RESIZE_AVATAR_SIZE), jimp.AUTO);
    }

    req.body.avatar = await write(photo, name);

    next();
}


module.exports = {
    filterAvatar, 
    filterPhoto, 
    resizeAndWritePhoto,
    resizeAndWriteAvatar
};

