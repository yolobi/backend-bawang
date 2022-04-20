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
  seeTipePenjualan,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetaniPedagang } = require('../middleware/check-role');

/* GET home page. */
router.post(
  '/tambahpenjualan',
  authenticateUser,
  checkIfPetaniPedagang,
  createPenjualan
);
router.get('/lihatpedagang', authenticateUser, checkIfPetaniPedagang, seePedagang);
router.put(
  '/ubahstatus/terima/:penjualanId',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusTerima
);
router.put(
  '/ubahstatus/tolak/:penjualanId',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusTolak
);
router.put(
  '/ubahstatus/ajukankembali/:penjualanId',
  authenticateUser,
  checkIfPetaniPedagang,
  changeStatusAjukan
);

router.get('/lihatpenjualan', authenticateUser, checkIfPetaniPedagang, seePenjualan);
router.get(
  '/lihatpenjualan/:penjualanId',
  authenticateUser,
  checkIfPetaniPedagang,
  seeAPenjualan
);

router.get(
  '/lihattipepenjualan',
  authenticateUser,
  checkIfPetaniPedagang,
  seeTipePenjualan
);

router.delete(
  '/hapuspenjualan/:penjualanId',
  authenticateUser,
  checkIfPetaniPedagang,
  deletePenjualan
);

module.exports = router;
