'use strict';

require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const format = require('date-fns/format');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const expressSanitizer = require('express-sanitizer');
const router = require('./routes.js');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts( { maxAge: 7776000000 })) ;
app.use(helmet.frameguard( 'SAMEORIGIN' )) ;
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(helmet.noSniff());

app.use(session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(expressSanitizer({}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.formatDate = (data) => data ? format(data, process.env.DATE_FORMAT) : null;
    if(req.body.submit)
        delete req.body.submit
    next();
});

require('./config/passport')(passport); 
require('./routes')(app, passport);

module.exports = app;