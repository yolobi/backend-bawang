var express = require('express');
var router = express.Router();
const { index, viewCreate, actionCreate, viewEdit } = require('./controller');

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);

module.exports = router;
