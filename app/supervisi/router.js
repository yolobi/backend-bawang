var express = require('express');
var router = express.Router();
const {
  createSupervisi,
  seeMySupervisi,
  deleteSupervisi,
  signinSupervise,
  signinSuperviseId,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPdh } = require('../middleware/check-role');

/* GET home page. */
router.post('/relog', authenticateUser, checkIfPdh, signinSupervise);
router.post('/relog/:userId', authenticateUser, checkIfPdh, signinSuperviseId);
router.post('/tambahsupervisi', authenticateUser, checkIfPdh, createSupervisi);
router.get('/lihatsupervisi', authenticateUser, checkIfPdh, seeMySupervisi);
router.delete('/hapussupervisi/:petaniId', authenticateUser, checkIfPdh, deleteSupervisi);

module.exports = router;
