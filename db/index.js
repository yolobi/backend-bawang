const mongoose = require('mongoose');
const { urlDb } = require('../config');

mongoose.connect(urlDb);
// mongoose.connect("mongodb+srv://aqshal_deandra:tugasProjectkuliah22@cluster0.whvyx.mongodb.net/db_backend_cabai?retryWrites=true&w=majority");
// mongoose.connect(
//   'mongodb+srv://aqshal_deandra:tugasProjectkuliah22@cluster0.whvyx.mongodb.net/db_backend_cabai?retryWrites=true&w=majority'
// );

const db = mongoose.connection;

module.exports = db;
