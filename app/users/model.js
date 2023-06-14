const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'nama harus diisi'],
      minlength: [3, 'panjang nama harus 3-55 karakter'],
      maxlength: [55, 'panjang nama harus 3-55 karakter'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (email) {
          if (email === '' || email === null) {
            return true;
          }
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: 'masukkan email yang valid',
      },
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'password harus diisi'],
      minlength: [6, 'password minimal 6 karakter'],
    },
    kecamatan: {
      type: Number,
      required: [true, 'kecamatan harus diisi'],
      validate: {
        validator: function (val) {
          return val.toString().length === 7;
        },
        message: 'id kecamatan yang dimasukkan harus berjumlah 7 digit',
      },
    },
    kabupaten: {
      type: Number,
      required: [true, 'kabupaten harus diisi'],
      validate: {
        validator: function (val) {
          return val.toString().length === 4;
        },
        message: 'id kabupaten/kota yang dimasukkan harus berjumlah 4 digit',
      },
    },
    provinsi: {
      type: Number,
      required: [true, 'provinsi harus diisi'],
      validate: {
        validator: function (val) {
          return val.toString().length === 2;
        },
        message: 'id kabupaten/kota yang dimasukkan harus berjumlah 2 digit',
      },
    },
    alamat: {
      type: String,
      required: [true, 'alamat harus diisi'],
    },
    role: {
      type: String,
      enum: [
        'petani',
        'agen',
        'distributor',
        'pengecer',
        'pengepul',
        'grosir',
        'pdh',
        'dinas',
      ],
      required: [true, 'role harus diisi'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
