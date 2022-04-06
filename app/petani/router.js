var express = require('express');
var router = express.Router();
const { index } = require('./controller');
const authenticateUser = require('../middleware/authentication');
const checkIfPetani = require('../middleware/check-petani');

/* GET home page. */
router.get('/', authenticateUser, checkIfPetani, index);

module.exports = router;
