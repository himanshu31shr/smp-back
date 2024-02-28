
var express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { post, get, put, getByCode, destroy } = require('../controllers/album.controller');
const linkController = require('../controllers/link.controller');
var router = express.Router();

router
  .get('/', authMiddleware, get)
  .get('/code', getByCode)
  .post('/',authMiddleware, post)
  .put('/', authMiddleware, put)
  .delete('/', authMiddleware, destroy);

router
  .post('/link', authMiddleware, linkController.post)
  .get('/link', authMiddleware, linkController.get);

module.exports = router;
