var express = require('express');
var router = express.Router();

const {
  addModal,
  getAllModal,
  editModal,
  deleteModal,
} = require('./controller');

const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

router.post('/addModal/:idLahan', authenticateUser, checkIfPetani, addModal);
router.get('/modal/:idLahan', authenticateUser, checkIfPetani, getAllModal);
router.put('/edit/:idModal', authenticateUser, checkIfPetani, editModal);
router.delete('/delete/:idModal', authenticateUser, checkIfPetani, deleteModal);

module.exports = router;
