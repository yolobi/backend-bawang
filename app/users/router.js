var express = require('express');
var router = express.Router();
const {
    seeProfile, editProfile
} = require('./controller');
const authenticateUser = require('../middleware/authentication');

/* GET home page. */
router.get('/profile', authenticateUser, seeProfile);
router.put('/profile', authenticateUser, editProfile);

module.exports = router;
