
var express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { get } = require('../controllers/people.controller');
var router = express.Router();

/* GET users listing. */

router
  .get('/', authMiddleware, get)

module.exports = router;
