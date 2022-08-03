var express = require('express');
var router = express.Router();
const {
  seeMyProfile,
  editProfile,
  getProfilebyID,
  getPetani,
  getPedagangbyTipe,
} = require('./controller');
const authenticateUser = require('../middleware/authentication');
const {
  checkIfPetani,
  checkIfPetaniPedagang,
} = require('../middleware/check-role');

/* GET home page. */
router.get('/myprofile', authenticateUser, seeMyProfile);

router.put('/profile', authenticateUser, editProfile);

router.get(
  '/lihatpedagang/:tipepedagang',
  authenticateUser,
  checkIfPetaniPedagang,
  getPedagangbyTipe
);

// ENDPOINT BARU
router.get('/profile/:idUser', authenticateUser, getProfilebyID);

router.put('/profile/edit', authenticateUser, editProfile);

router.get('/petani', authenticateUser, getPetani);

router.get(
  '/pedagang/:tipepedagang',
  authenticateUser,
  checkIfPetaniPedagang,
  getPedagangbyTipe
);

module.exports = router;
