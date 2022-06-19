var express = require('express');
var router = express.Router();
const {
  createLahan,
  seeNameLahan,
  addLuasRusak,
  seeMyLahan,
  editModal,
  seeALahan,
  lahanFinish,
  lahanUnfinish,
  deleteLahan,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahlahan', authenticateUser, checkIfPetani, createLahan);
router.put('/rusak/:lahanId', authenticateUser, checkIfPetani, addLuasRusak);
router.put('/modal/:lahanId', authenticateUser, checkIfPetani, editModal);

router.get('/namalahan', authenticateUser, checkIfPetani, seeNameLahan);
router.get('/lihatlahan', authenticateUser, checkIfPetani, seeMyLahan);
router.get('/lihatlahan/:lahanId', authenticateUser, checkIfPetani, seeALahan);


router.put('/selesai/:lahanId', authenticateUser, checkIfPetani, lahanFinish);
router.put('/batalselesai/:lahanId', authenticateUser, checkIfPetani, lahanUnfinish);

router.delete(
  '/hapus/:lahanId',
  authenticateUser,
  checkIfPetani,
  deleteLahan
);

module.exports = router;
