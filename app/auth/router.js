var express = require('express');
var router = express.Router();
const { signup } = require('./controller');

/* GET home page. */
router.post('/signup', signup);

module.exports = router;
