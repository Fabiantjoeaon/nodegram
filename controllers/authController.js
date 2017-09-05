const User = require('../models/User');

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
    const {username, password} = req.body;

    const user = new User({
        username,
        password
    });

    await user.save();
    
    return res.redirect('/auth/signup');
}

module.exports = {
    renderSignUp,
    renderLogin,
    signup
}