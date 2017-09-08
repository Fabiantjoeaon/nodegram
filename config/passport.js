const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = (passport) => {

    // HINT: Serialize user for session usage
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // HINT: De-erialize user for session usage
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local', new LocalStrategy({
        passReqToCallback : true
    },

    async (req, username, password, done) => { 
        const user = await User.findOne({username});
        
        if (!user)
            return done(null, false, req.flash('error', 'Wrong credentials.')); 

        const isPasswordMatching = await user.comparePassword(password);
        
        if (!isPasswordMatching)
            return done(null, false, req.flash('error', 'Wrong credentials.')); 
        
        req.flash('success', `Welcome ${user.username}`);
        return done(null, user);
    }));
}