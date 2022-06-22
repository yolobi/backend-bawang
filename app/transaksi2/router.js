var express = require('express');
var router = express.Router();
const {
  createTransaksi,
  seePedagang,
  seeMyTransaksi,
  seeATransaksi,
  deleteTransaksi,
  changeStatusAjukan,
  changeStatusTerima,
  changeStatusTolak,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const {
  checkIfPetani,
  checkIfPetaniPedagang,
} = require('../middleware/check-role');

/* GET home page. */
router.post(
  '/tambahtransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  createTransaksi
);
router.get(
  '/lihatpedagang/:tipepedagang',
  authenticateUser,
  checkIfPetaniPedagang,
  seePedagang
);

router.get(
  '/lihattransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  seeMyTransaksi
);

router.get(
  '/lihattransaksi/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  seeATransaksi
);

router.delete(
  '/hapustransaksi/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  deleteTransaksi
);

router.put(
  '/ubahstatus/terima/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusTerima
);
router.put(
  '/ubahstatus/tolak/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusTolak
);
router.put(
  '/ubahstatus/ajukankembali/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusAjukan
);
module.exports = router;
