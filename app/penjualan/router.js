var express = require('express');
var router = express.Router();
const {
  createPenjualan,
  seePedagang,
  changeStatusTerima,
  changeStatusTolak,
  changeStatusAjukan,
  seePenjualan,
  seeAPenjualan,
  deletePenjualan,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post(
  '/tambahpenjualan',
  authenticateUser,
  checkIfPetani,
  createPenjualan
);
router.get('/lihatpedagang', authenticateUser, checkIfPetani, seePedagang);
router.put(
  '/ubahstatus/terima/:penjualanId',
  authenticateUser,
  checkIfPetani,
  changeStatusTerima
);
router.put(
  '/ubahstatus/tolak/:penjualanId',
  authenticateUser,
  checkIfPetani,
  changeStatusTolak
);
router.put(
  '/ubahstatus/ajukankembali/:penjualanId',
  authenticateUser,
  checkIfPetani,
  changeStatusAjukan
);

router.get('/lihatpenjualan', authenticateUser, checkIfPetani, seePenjualan);
router.get(
  '/lihatpenjualan/:penjualanId',
  authenticateUser,
  checkIfPetani,
  seeAPenjualan
);
router.delete(
  '/hapuspenjualan/:penjualanId',
  authenticateUser,
  checkIfPetani,
  deletePenjualan
);

module.exports = router;
