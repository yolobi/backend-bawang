var express = require('express');
var router = express.Router();
const {
  createStok,
  seeMyStok,
  seeAStok,
  deleteStok,
  index,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahstok', authenticateUser, checkIfPetani, createStok);
router.get('/lihatstok', authenticateUser, checkIfPetani, seeMyStok);
router.get('/lihatstok/:stokId', authenticateUser, checkIfPetani, seeAStok);
router.delete(
  '/hapusstok/:stokId',
  authenticateUser,
  checkIfPetani,
  deleteStok
);

router.get('/', authenticateUser, checkIfPetani, index);

module.exports = router;
