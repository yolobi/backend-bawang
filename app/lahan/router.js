var express = require('express');
var router = express.Router();
const {
  editModal,
  deleteLahan,
  addLahan,
  editLuasRusak,
  getLahanAll,
  getLahanbyID,
  getTipefromLahan,
  getNamafromLahan,
  editFinishLahan,
  editActivateLahan,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahlahan', authenticateUser, checkIfPetani, addLahan);

router.get('/namalahan', authenticateUser, checkIfPetani, getNamafromLahan);
router.get('/lihatlahan', authenticateUser, checkIfPetani, getLahanAll);
router.get(
  '/lihatlahan/:idLahan',
  authenticateUser,
  checkIfPetani,
  getLahanbyID
);
router.get(
  '/lihattipelahan',
  authenticateUser,
  checkIfPetani,
  getTipefromLahan
);

router.put(
  '/batalselesai/:lahanId',
  authenticateUser,
  checkIfPetani,
  editActivateLahan
);

// ENDPOINT BARU
router.post('/tambah', authenticateUser, checkIfPetani, addLahan);

router.put('/rusak/:idLahan', authenticateUser, checkIfPetani, editLuasRusak);

router.put('/modal/:idLahan', authenticateUser, checkIfPetani, editModal);

router.get('/', authenticateUser, checkIfPetani, getLahanAll);

router.get('/tipe', authenticateUser, checkIfPetani, getTipefromLahan);

router.get('/nama', authenticateUser, checkIfPetani, getNamafromLahan);

router.get('/:idLahan', authenticateUser, checkIfPetani, getLahanbyID);

router.put(
  '/selesai/:idLahan',
  authenticateUser,
  checkIfPetani,
  editFinishLahan
);

router.put(
  '/aktifkan/:idLahan',
  authenticateUser,
  checkIfPetani,
  editActivateLahan
);

router.delete('/hapus/:idLahan', authenticateUser, checkIfPetani, deleteLahan);

module.exports = router;
