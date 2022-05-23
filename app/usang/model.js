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
      required: [true, 'tipeCabai harus diisi'],
    },
    jumlahUsang: {
      type: Number,
      required: [true, 'jumlahUsang harus diisi'],
    },
    hargaJual: {
      type: Number,
      required: [true, 'hargaJual harus diisi'],
    },
    tanggalPencatatan: {
      type: Date,
      required: [true, 'tanggalPencatatan harus diisi'],
      default: Date.now,
    },
    pemanfaatan: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usang', usangSchema);
