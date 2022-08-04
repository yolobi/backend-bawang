var express = require('express');
var router = express.Router();
const { signup, login } = require('./controller');

/* GET home page. */
router.post('/daftar', signup);
router.post('/masuk', login);

module.exports = router;
