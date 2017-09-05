const express = require('express');
const router = express.Router();

const {catchErrors} = require('./middleware/errorMiddleware');
const authController = require('./controllers/authController');

router.get('/auth/signup', catchErrors(authController.renderSignUp));
router.get('/auth/login', authController.renderLogin);

router.get('/', (req, res) => {
    res.send('bla');
})

module.exports = router;