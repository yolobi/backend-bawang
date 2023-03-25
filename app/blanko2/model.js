const mongoose = require('mongoose');

let blanko2Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tanggalPencatatan: {
      type: Date,
      default: Date.now,
    },
    komoditas: {
      type: String,
      enum: [
        'cabaiMerahBesar',
        'cabaiMerahKeriting',
        'cabaiRawitMerah',
        'bawangMerah',
        'bawangPutih',
      ],
    },
    // dst untuk tiap atribut pada class Blanko
    luasTanamanAkhirBulanLalu: {
      type: Number,
      default: null,
    },
    luasPanenHabis: {
      type: Number,
      default: null,
    },
    luasPanenBelumHabis: {
      type: Number,
      default: null,
    },
    luasRusak: {
      type: Number,
      default: null,
    },
    luasPenanamanBaru: {
      type: Number,
      default: null,
    },
    luasTanamanAkhirBulanLaporan: {
      type: Number,
      default: null,
    },
    prodPanenHabis: {
      type: Number,
      default: null,
    },
    prodBelumHabis: {
      type: Number,
      default: null,
    },
    rataHargaJual: {
      type: Number,
      default: null,
    },
    kecamatan: {
      type: Number,
      validate: {
        validator: function (val) {
          return val.toString().length === 7;
        },
        message: 'id kecamatan yang dimasukkan harus berjumlah 7 digit',
      },
    },
    kabupaten: {
      type: Number,
      validate: {
        validator: function (val) {
          return val.toString().length === 4;
        },
        message: 'id kabupaten/kota yang dimasukkan harus berjumlah 4 digit',
      },
    },
    provinsi: {
      type: Number,
      validate: {
        validator: function (val) {
          return val.toString().length === 2;
        },
        message: 'id kabupaten/kota yang dimasukkan harus berjumlah 2 digit',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blanko2', blanko2Schema);
