var express = require('express');
var router = express.Router();
const {
  deleteSupervisi,
  addSupervisi,
  getSupervisiAll,
  loginSupervisi,
  loginSupervisibyID,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPdh } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahsupervisi', authenticateUser, checkIfPdh, addSupervisi);
router.post('/relog', authenticateUser, checkIfPdh, loginSupervisi);
router.post('/relog/:idUser', authenticateUser, checkIfPdh, loginSupervisibyID);
router.get('/lihatsupervisi', authenticateUser, checkIfPdh, getSupervisiAll);
router.delete('/hapussupervisi/:petaniId', authenticateUser, checkIfPdh, deleteSupervisi);

// ENDPOINT BARU
router.post('/tambah', authenticateUser, checkIfPdh, addSupervisi);

router.get('/', authenticateUser, checkIfPdh, getSupervisiAll);

router.post('/masuk', authenticateUser, checkIfPdh, loginSupervisi);

router.post('/masuk/:idUser', authenticateUser, checkIfPdh, loginSupervisibyID);

router.delete(
  '/hapus/:idPetani',
  authenticateUser,
  checkIfPdh,
  deleteSupervisi
);

module.exports = router;
