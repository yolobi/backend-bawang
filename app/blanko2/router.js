var express = require('express');
var router = express.Router();

const { createBlanko, seeMyBlanko, seeABlanko, untuktestisng } = require('./controller');

const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

router.post('/tambahblanko', authenticateUser, checkIfPetani, createBlanko);
router.get('/lihatblanko', authenticateUser, checkIfPetani, seeMyBlanko);
router.get(
  '/lihatblanko/:blankoId',
  authenticateUser,
  checkIfPetani,
  seeABlanko
);

router.post(
  '/untuktesting',
  authenticateUser,
  checkIfPetani,
  untuktestisng
);

module.exports = router;
