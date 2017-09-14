const ensureLoggedIn = async (req, res, next) => {
    if(req.isAuthenticated())
        return next();

    req.flash('error', 'Please log in to access this page!');
    return res.redirect('/auth/login');
}

const ensureLoggedOut = async (req, res, next) => {
    if(!req.isAuthenticated())
        return next();

    req.flash('error', 'You are already logged in!');
    return res.redirect('back');
}

module.exports = {
    ensureLoggedIn,
    ensureLoggedOut
}
