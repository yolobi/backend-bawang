var express = require('express');
var router = express.Router();
const {
    seeMyProfile, editProfile, seeProfile, seePetani
} = require('./controller');
const authenticateUser = require('../middleware/authentication');

/* GET home page. */
router.get('/myprofile', authenticateUser, seeMyProfile);
router.get('/profile/:userId', authenticateUser, seeProfile);
router.put('/profile', authenticateUser, editProfile);
router.get('/petani', authenticateUser, seePetani);


module.exports = router;
