const {catchErrors} = require('./middleware/errorMiddleware');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const webController = require('./controllers/webController');
const {ensureLoggedIn, ensureLoggedOut} = require('./middleware/authMiddleware');

module.exports = (app, passport) => {
    /**
     * AUTH
     */
    app.get('/auth/signup', ensureLoggedOut, authController.renderSignUp);
    app.get('/auth/login', ensureLoggedOut, authController.renderLogin);
    app.post('/auth/signup', ensureLoggedOut, catchErrors(authController.signup))
    app.post('/auth/login', ensureLoggedOut, passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/auth/login',
        failureFlash : true 
    }))
    app.get('/auth/logout', ensureLoggedIn, authController.logout);

    /**
     * WEB
     */
    app.get('/', webController.renderHome);

    /**
     * USER
     */
    app.get('/users/:username', ensureLoggedIn, userController.show);
}


