var express = require('express');
var router = express.Router();
const {
  createTransaksi,
  seePedagang,
  changeStatusTerima,
  changeStatusTolak,
  changeStatusAjukan,
  seeMyTransaksi,
  seeATransaksi,
  deleteTransaksi,
  seeTipeTransaksi,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetaniPedagang } = require('../middleware/check-role');

/* GET home page. */
router.post(
  '/tambahtransaksi',
  authenticateUser,
  checkIfPetaniPedagang,
  createTransaksi
);
router.get('/lihatpedagang/:tipepedagang', authenticateUser, checkIfPetaniPedagang, seePedagang);
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

router.get('/lihattransaksi', authenticateUser, checkIfPetaniPedagang, seeMyTransaksi);
router.get(
  '/lihattransaksi/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  seeATransaksi
);

router.get(
  '/lihattransaksibytype/:tipecabai',
  authenticateUser,
  checkIfPetaniPedagang,
  seeTipeTransaksi
);

router.delete(
  '/hapustransaksi/:transaksiId',
  authenticateUser,
  checkIfPetaniPedagang,
  deleteTransaksi
);

module.exports = router;
