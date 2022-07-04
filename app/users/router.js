var express = require('express');
var router = express.Router();
const {
  seeMyProfile,
  editProfile,
  seeProfile,
  seePetani,
  seePedagang,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const {
  checkIfPetani,
  checkIfPetaniPedagang,
} = require('../middleware/check-role');

/* GET home page. */
router.get('/myprofile', authenticateUser, seeMyProfile);
router.get('/profile/:userId', authenticateUser, seeProfile);
router.put('/profile', authenticateUser, editProfile);
router.get('/petani', authenticateUser, seePetani);

router.get(
  '/lihatpedagang/:tipepedagang',
  authenticateUser,
  checkIfPetaniPedagang,
  seePedagang
);

module.exports = router;
