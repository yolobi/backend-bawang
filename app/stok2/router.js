var express = require('express');
var router = express.Router();
const { sinkronStok, stokByBulan } = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani, checkIfPedagang } = require('../middleware/check-role');

/* GET home page. */
router.put('/sinkron', authenticateUser, checkIfPedagang, sinkronStok);

router.get('/:bulan', authenticateUser, checkIfPedagang, stokByBulan);
router.get('/:bulanbaru', authenticateUser, checkIfPedagang, stokByBulan);

module.exports = router;
