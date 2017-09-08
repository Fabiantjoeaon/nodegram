const User = require('../models/User');

const show = async (req, res) => {
    const resourceUser = 
        await User.findOne({'username': req.params.username});
    
    res.render('profile', {
        title: `${resourceUser.username}`,
        resourceUser: resourceUser
    });
}

module.exports = {
    show
}