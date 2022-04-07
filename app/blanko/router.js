var express = require('express');
var router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
  createBlanko,
  allBlanko,
  editBlanko,
  seeMyBlanko,
  deleteBlanko,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionEdit);
router.delete('/delete/:id', actionDelete);

// API
router.get('/all', authenticateUser, allBlanko);
router.post('/createblanko', authenticateUser, checkIfPetani, createBlanko);
router.put('/editblanko/:id', authenticateUser, checkIfPetani, editBlanko);
router.get('/seemyblanko', authenticateUser, checkIfPetani, seeMyBlanko);
router.delete(
  '/deleteblanko/:id',
  authenticateUser,
  checkIfPetani,
  deleteBlanko
);

module.exports = router;
