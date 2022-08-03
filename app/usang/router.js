var express = require('express');
var router = express.Router();
const {
  addUsang, getUsangAll, getUsangbyID, getUsangbyTipe, deleteUsang
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPedagang } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahusang', authenticateUser, checkIfPedagang, addUsang);

router.get('/lihatusang', authenticateUser, checkIfPedagang, getUsangAll);
router.get('/lihatusang/:idUsang', authenticateUser, checkIfPedagang, getUsangbyID);

router.get(
  '/lihatusangbytype/:tipecabai',
  authenticateUser,
  checkIfPedagang,
  getUsangbyTipe
);
router.delete('/hapususang/:idUsang', authenticateUser, checkIfPedagang, deleteUsang);


// ENDPOINT BARU
router.post('/tambah', authenticateUser, checkIfPedagang, addUsang);

router.get('/', authenticateUser, checkIfPedagang, getUsangAll);

router.get(
  '/:idUsang',
  authenticateUser,
  checkIfPedagang,
  getUsangbyID
);

router.get(
  '/tipe/:tipecabai',
  authenticateUser,
  checkIfPedagang,
  getUsangbyTipe
);

router.delete(
  '/hapus/:idUsang',
  authenticateUser,
  checkIfPedagang,
  deleteUsang
);

module.exports = router;
