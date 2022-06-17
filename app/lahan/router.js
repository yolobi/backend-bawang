var express = require('express');
var router = express.Router();
const {
  createLahan, seeNameLahan, addLuasRusak,seeMyLahan
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const { checkIfPetani } = require('../middleware/check-role');

/* GET home page. */
router.post('/tambahlahan', authenticateUser, checkIfPetani, createLahan);
router.put(
  '/rusak/:lahanId',
  authenticateUser,
  checkIfPetani,
  addLuasRusak
);

router.get('/namalahan', authenticateUser, checkIfPetani, seeNameLahan);
router.get('/lihatlahan', authenticateUser, checkIfPetani, seeMyLahan);


module.exports = router;
