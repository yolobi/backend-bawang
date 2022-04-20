const mongoose = require('mongoose');

let usangSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      require: true,
    },
    jumlahUsang: {
      type: Number,
      require: true,
    },
    hargaJual: {
      type: Number,
      require: true,
    },
    tanggalPencatatan: {
      type: Date,
      require: true,
      default: Date.now,
    },
    pemanfaatan: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usang', usangSchema);
