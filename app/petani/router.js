var express = require('express');
var router = express.Router();
const { index } = require('./controller');
const authenticateUser = require('../middleware/authentication')
const checkIfPetani = require('../middleware/check-petani');
const checkIfPedagang = require('../middleware/check-pedagang');

/* GET home page. */
router.get('/', authenticateUser, checkIfPedagang, index);

module.exports = router;
