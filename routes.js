const express = require('express');
const router = express.Router();

const {catchErrors} = require('./middleware/errorMiddleware');
const authController = require('./controllers/authController');

router.get('/auth/signup', authController.renderSignUp);
router.get('/auth/login', authController.renderLogin);
router.post('/auth/signup', catchErrors(authController.signup))

module.exports = router;