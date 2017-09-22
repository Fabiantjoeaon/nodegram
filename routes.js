const {catchErrors} = require('./middleware/errorMiddleware');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const photoController = require('./controllers/photoController');
const webController = require('./controllers/webController');
const {ensureLoggedIn, ensureLoggedOut} = require('./middleware/authMiddleware');
const {
    filterAvatar, 
    filterPhoto, 
    resizeAndWritePhoto,
    resizeAndWriteAvatar
} = require('./middleware/uploadMiddleware');
const {
    ensureThisUser,
    ensureSystemAdmin
} = require('./middleware/ensureMiddleware');

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
        failureFlash : true,
        successFlash: true 
    }))
    app.get('/auth/logout', ensureLoggedIn, authController.logout);

    /**
     * WEB
     */
    app.get('/', webController.renderHome);

    app.get(
        '/photos', 
        ensureLoggedIn, 
        ensureSystemAdmin,
        catchErrors(photoController.index)
    );
    app.get(
        '/users', 
        ensureLoggedIn, 
        ensureSystemAdmin,
        catchErrors(userController.index)
    );

    /**
     * USER
     */
    app.get('/timeline', ensureLoggedIn, userController.renderTimeline);
    app.get('/users/:username', ensureLoggedIn, userController.show);
    app.get('/users/:username/edit', ensureLoggedIn, ensureThisUser, userController.showEdit);
    app.post('/users/:username/edit', ensureLoggedIn, 
        ensureThisUser,
        filterAvatar, catchErrors(resizeAndWriteAvatar), 
        userController.edit);
    app.get('/users/:username/follow', ensureLoggedIn, catchErrors(userController.follow));
    app.get('/users/:username/unfollow', ensureLoggedIn, catchErrors(userController.unfollow));
    app.get('/users/:username/followers', ensureLoggedIn, catchErrors(userController.showFollowers));
    app.get('/users/:username/following', ensureLoggedIn, catchErrors(userController.showFollowing));
    app.get('/users/:username/destroy', ensureLoggedIn, ensureThisUser, catchErrors(userController.destroy));

    /**
     * PHOTO
     */
    app.get('/photos/new', ensureLoggedIn, photoController.showCreate);
    app.post('/photos/new', ensureLoggedIn, 
        filterPhoto, catchErrors(resizeAndWritePhoto), 
        photoController.create);

    app.get(
        '/photos/:uuid', 
        ensureLoggedIn, 
        photoController.show
    );
    app.post('/photos/:uuid/like', ensureLoggedIn, 
        catchErrors(photoController.like));
    app.post('/photos/:uuid/comment', ensureLoggedIn, 
        catchErrors(photoController.comment));
    app.get('/photos/:uuid/likes', ensureLoggedIn, 
        photoController.showLikes);
    app.get('/photos/:uuid/comments', ensureLoggedIn, 
        photoController.showComments);
    app.get('/photos/:uuid/delete', ensureLoggedIn, 
        catchErrors(photoController.destroy));
    app.get('/photos/:uuid/delete-comment/:comment_id', ensureLoggedIn, 
        catchErrors(photoController.destroyComment));
    
    app.get('*', (req, res) => {
        return res.render('404', {title: 'Not found'});
    });
          
}

