var express = require('express');
const { get, post, put } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
var router = express.Router();

/* GET users listing. */

router
  .get('/', authMiddleware, get)
  .post('/', post)
  .put('/', put);

module.exports = router;
