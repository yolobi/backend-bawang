var express = require('express');
var router = express.Router();
const {
  createSupervisi,
  seeMySupervisi,
  deleteSupervisi,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPdh } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahsupervisi', authenticateUser, checkIfPdh, createSupervisi);
router.get('/lihatsupervisi', authenticateUser, checkIfPdh, seeMySupervisi);
router.delete('/hapussupervisi/:petaniId', authenticateUser, checkIfPdh, deleteSupervisi);

module.exports = router;
