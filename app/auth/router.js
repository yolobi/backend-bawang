var express = require('express');
var router = express.Router();
const { signup, signin, signinSupervise } = require('./controller');

/* GET home page. */
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signinspecial' ,signinSupervise)

module.exports = router;
