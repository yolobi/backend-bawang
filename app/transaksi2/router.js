var express = require('express');
var router = express.Router();
const {
  addTransaksi,
  deleteTransaksi,
  changeStatusAjukan,
  changeStatusTerima,
  changeStatusTolak,
  addTransaksiforPetani,
  addTransaksiforPedagang,
  getTransaksiAll,
  getTransaksibyID,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const {
  checkIfPetani,
  checkIfPetaniPedagang,
  checkIfPedagang,
} = require('../middleware/check-role');

/* GET home page. */
router.post(
  '/tambahtransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  addTransaksi
);

router.get(
  '/lihattransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  getTransaksiAll
);

router.get(
  '/lihattransaksi/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  getTransaksibyID
);


router.delete(
  '/hapustransaksi/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  deleteTransaksi
);


// ROUTER YANG BARU
router.post(
  '/petani/tambah',
  authenticateUser,
  checkIfPetani,
  addTransaksiforPetani
);

router.post(
  '/pedagang/tambah',
  authenticateUser,
  checkIfPedagang,
  addTransaksiforPedagang
);

router.get(
  '/',
  authenticateUser,
  checkIfPetaniPedagang,
  getTransaksiAll
);

router.get(
  '/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  getTransaksibyID
);

router.delete(
  '/hapus/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  deleteTransaksi
);

router.put(
  '/ubahstatus/terima/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusTerima
);
router.put(
  '/ubahstatus/tolak/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusTolak
);
router.put(
  '/ubahstatus/ajukankembali/:idTransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusAjukan
);




module.exports = router;
