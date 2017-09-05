const User = require('../models/User');
const validate = require('validate.js');

const renderSignUp = async (req, res) => {
    return res.render('auth/signup', {
        title: 'Sign up'
    });
}

const renderLogin = (req, res) => {
    return res.render('auth/login', {
        title: 'Login'
    });
}

const signup = async (req, res) => {
    req.body.username = req.sanitize(req.body.username);
    const {username, password} = req.body;

    const errors = validate(req.body, User.getInitialConstraints());
    
    if(errors) {
        req.flash('error', errors);
        return res.redirect('back');
    }

    const existingUser = await User.findOne({
        username
    });

    if(existingUser) {
        req.flash('error', 'Username is already taken');
        return res.redirect('back');
    }
        
    const user = new User({
        username,
        password
    });
    await user.save();

    req.flash('success', `Succesfully signed up, ${username}!`);
    return res.redirect('/auth/login');
}

const logout = async (req, res) => {
    req.logout();
    req.session.user = null;
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
}

module.exports = {
    renderSignUp,
    renderLogin,
    signup,
    logout
}