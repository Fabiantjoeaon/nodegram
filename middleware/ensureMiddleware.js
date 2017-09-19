// const User = require('../models/User');

/**
*
* @param {Object} req 
* @param {Object} res 
* @param {Function} next 
* @returns {Function}
*/
const ensureSystemAdmin = (req, res, next) => {
    if(req.user.isAdmin) return next();

    req.flash('You are not allowed to access this page.');
    return res.redirect('back');
}

const ensureThisUser = async (req, res, next) => {
    if(req.user.isAdmin) return next();

    if(req.params.username === req.user.username) return next();

    req.flash('You are not allowed to access this page.');
    return res.redirect('back');
}

module.exports = {
    ensureSystemAdmin,
    ensureThisUser
}
