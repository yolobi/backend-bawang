var express = require('express');
var router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
} = require('./admincontroller');

const {
  createBlanko,
  seeMyBlanko,
  seeABlanko,
  deleteBlanko,
} = require('./controller');

const authenticateUser = require('../middleware/authentication');
const { checkIfPetani, checkIfAdmin } = require('../middleware/check-role');

/* GET home page. */
router.get('/', index);
router.get('/create', authenticateUser, checkIfAdmin, viewCreate);
router.post('/create', authenticateUser, checkIfAdmin, actionCreate);
router.get('/edit/:id', authenticateUser, checkIfAdmin, viewEdit);
router.put('/edit/:id', authenticateUser, checkIfAdmin, actionEdit);
router.delete('/delete/:id', authenticateUser, checkIfAdmin, actionDelete);

// API
router.post('/tambahblanko', authenticateUser, checkIfPetani, createBlanko);
router.get('/lihatblanko', authenticateUser, checkIfPetani, seeMyBlanko);
router.get(
  '/lihatblanko/:blankoId',
  authenticateUser,
  checkIfPetani,
  seeABlanko
);
router.delete(
  '/hapusblanko/:id',
  authenticateUser,
  checkIfPetani,
  deleteBlanko
);

module.exports = router;
