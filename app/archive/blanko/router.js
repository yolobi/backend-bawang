var express = require('express');
var router = express.Router();

const {
  createBlanko,
  seeMyBlanko,
  seeABlanko,
  deleteBlanko,
  seeTipeBlanko,
} = require('./controller');

const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

// API
router.post('/tambahblanko', authenticateUser, checkIfPetani, createBlanko);
router.get('/lihatblanko', authenticateUser, checkIfPetani, seeMyBlanko);
router.get(
  '/lihatblanko/:blankoId',
  authenticateUser,
  checkIfPetani,
  seeABlanko
);
router.get(
  '/lihatblankobytype/:tipecabai',
  authenticateUser,
  checkIfPetani,
  seeTipeBlanko
);
router.delete(
  '/hapusblanko/:blankoId',
  authenticateUser,
  checkIfPetani,
  deleteBlanko
);

module.exports = router;
