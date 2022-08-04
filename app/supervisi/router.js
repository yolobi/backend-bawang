var express = require('express');
var router = express.Router();
const {
  deleteSupervisi,
  signinSupervise,
  signinSuperviseId,
  addSupervisi,
  getSupervisiAll,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPdh } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahsupervisi', authenticateUser, checkIfPdh, addSupervisi);
router.post('/relog', authenticateUser, checkIfPdh, signinSupervise);
router.post('/relog/:userId', authenticateUser, checkIfPdh, signinSuperviseId);
router.get('/lihatsupervisi', authenticateUser, checkIfPdh, getSupervisiAll);
router.delete('/hapussupervisi/:petaniId', authenticateUser, checkIfPdh, deleteSupervisi);

// ENDPOINT BARU
router.post('/tambah', authenticateUser, checkIfPdh, addSupervisi);

router.get('/', authenticateUser, checkIfPdh, getSupervisiAll);

router.post('/akuisisi', authenticateUser, checkIfPdh, signinSupervise);

router.delete(
  '/hapus/:idPetani',
  authenticateUser,
  checkIfPdh,
  deleteSupervisi
);

module.exports = router;
