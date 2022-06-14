var express = require('express');
var router = express.Router();
const { createTanam, seeMyTanam , seeATanam, changeStatus} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahtanam', authenticateUser, checkIfPetani, createTanam);

router.get('/lihattanam', authenticateUser, checkIfPetani, seeMyTanam);
router.get('/lihattanam/:tanamId', authenticateUser, checkIfPetani, seeATanam);

router.post('/ubahstatus/:tanamId', authenticateUser, checkIfPetani, changeStatus);

module.exports = router;