
var express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { post, getByPeople, get } = require('../controllers/photo.controller');
var router = express.Router();

router
  .get('/public', getByPeople)
  .get('/', authMiddleware, get)
  .post('/',authMiddleware, post)
//   .put('/', put);

module.exports = router;
