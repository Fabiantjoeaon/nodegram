const User = require('../models/User');

const renderSignUp = async (req, res) => {
    console.log('here')
    const user = new User({
        username: 'fabian',
        password: 'bla'
    });
    
    await user.save();
    console.log('saved')
}

const renderLogin = (req, res) => {

}

module.exports = {
    renderSignUp,
    renderLogin
}