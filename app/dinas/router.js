var express = require('express');
var router = express.Router();
const { index } = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani, checkIfDinas } = require('../middleware/check-role');

/* GET home page. */
router.get('/', authenticateUser, checkIfDinas, index);

module.exports = router;
