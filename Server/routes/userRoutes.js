const express = require('express');

const check = require('express-validator');
const checkAuth = require('../middleware/checkAuth');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);

router.post('/signup', userController.signup);

router.use(checkAuth);

module.exports = router;