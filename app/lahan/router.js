var express = require('express');
var router = express.Router();
const {
  editModal,
  deleteLahan,
  addLahan,
  editLuasRusak,
  getLahanAll,
  getLahanbyID,
  getKomoditasfromLahan,
  getPupukfromLahan,
  getNamafromLahan,
  editFinishLahan,
  editActivateLahan,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */

// ENDPOINT BARU
router.get('/', authenticateUser, checkIfPetani, getLahanAll);

router.post('/tambah', authenticateUser, checkIfPetani, addLahan);

router.get('/nama', authenticateUser, checkIfPetani, getNamafromLahan);

router.get(
  '/komoditas',
  authenticateUser,
  checkIfPetani,
  getKomoditasfromLahan
);

router.get('/pupuk', authenticateUser, checkIfPetani, getPupukfromLahan);

router.put('/rusak/:idLahan', authenticateUser, checkIfPetani, editLuasRusak);

router.get('/view/:idLahan', authenticateUser, checkIfPetani, getLahanbyID);

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

// DEPRECATED
//pindah ke Modal -> tambahModal
router.put('/modal/:idLahan', authenticateUser, checkIfPetani, editModal);

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
  getKomoditasfromLahan
);

router.put(
  '/batalselesai/:lahanId',
  authenticateUser,
  checkIfPetani,
  editActivateLahan
);

module.exports = router;
