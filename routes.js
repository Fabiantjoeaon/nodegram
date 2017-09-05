const {catchErrors} = require('./middleware/errorMiddleware');
const authController = require('./controllers/authController');

module.exports = (app, passport) => {
    app.get('/auth/signup', authController.renderSignUp);
    app.get('/auth/login', authController.renderLogin);
    app.post('/auth/signup', catchErrors(authController.signup))
    app.post('/auth/login', passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/auth/login',
        failureFlash : true 
    }))
}


