var express = require('express');
var router = express.Router();
const { sinkronStok } = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani, checkIfPedagang } = require('../middleware/check-role');

/* GET home page. */
router.put('/sinkron', authenticateUser, checkIfPedagang, sinkronStok);

module.exports = router;
