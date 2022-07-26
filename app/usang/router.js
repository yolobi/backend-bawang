var express = require('express');
var router = express.Router();
const {
  index, createUsang, seeMyUsang, seeAUsang, seeTipeUsang, deleteUsang
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPedagang } = require('../middleware/check-role');

/* GET home page. */
router.get('/', authenticateUser, checkIfPedagang, index);
router.post('/tambahusang', authenticateUser, checkIfPedagang, createUsang);

router.get('/lihatusang', authenticateUser, checkIfPedagang, seeMyUsang);
router.get('/lihatusang/:usangId', authenticateUser, checkIfPedagang, seeAUsang);
router.get(
  '/lihatusangbytype/:tipecabai',
  authenticateUser,
  checkIfPedagang,
  seeTipeUsang
);
router.delete('/hapususang/:usangId', authenticateUser, checkIfPedagang, deleteUsang);


module.exports = router;
