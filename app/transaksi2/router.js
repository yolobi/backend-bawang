var express = require('express');
var router = express.Router();
const { createTransaksi, seePedagang, seeMyTransaksi, seeATransaksi, deleteTransaksi } = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahtransaksi', authenticateUser, checkIfPetani, createTransaksi);
router.get(
  '/lihatpedagang/:tipepedagang',
  authenticateUser,
  checkIfPetani,
  seePedagang
);

router.get(
  '/lihattransaksi',
  authenticateUser,
  checkIfPetani,
  seeMyTransaksi
);

router.get(
  '/lihattransaksi/:transaksiId',
  authenticateUser,
  checkIfPetani,
  seeATransaksi
);

router.delete(
  '/hapustransaksi/:transaksiId',
  authenticateUser,
  checkIfPetani,
  deleteTransaksi
);

module.exports = router;
