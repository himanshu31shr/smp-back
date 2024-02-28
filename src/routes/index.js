var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/user', require('./users'))
router.use('/auth', require('./auth'))
router.use('/album', require('./album'))
router.use('/photo', require('./photo'))
router.use('/people', require('./people'))

module.exports = router;
