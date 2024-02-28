var express = require('express');
const { login, register } = require('../controllers/auth.controller');
var router = express.Router();

/* GET home page. */
router.use('/login', login);
router.use('/register', register);

module.exports = router;
