const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HASH_ROUND = 10;

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'nama harus diisi'],
      minlength: [3, 'panjang nama harus 3-55 karakter'],
      maxlength: [55, 'panjang nama harus 3-55 karakter'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'maukkan email yang valid',
      },
      required: [true, 'Email wajib diisi'],
    },
    password: {
      type: String,
      require: true,
      minlength: [6, 'password minimal 6 karakter'],
    },
    role: {
      type: String,
      enum: [
        'petani',
        'agen',
        'distributor',
        'pengecer',
        'pengepul',
        'pdh',
        'dinasPertanianKota',
        'dinasPertanianProvinsi',
      ],
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
