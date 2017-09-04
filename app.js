'use strict';

require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const helmet = require('helmet');
const expressSanitizer = require('express-sanitizer');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use( helmet.hsts( { maxAge: 7776000000 } ) ) ;
app.use( helmet.frameguard( 'SAMEORIGIN' ) ) ;
app.use(helmet.xssFilter( { setOnOldIE: true } ));
app.use(helmet.noSniff());

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(expressSanitizer({}));

app.use(flash());

module.exports = app;