const mongoose = require('mongoose');

let usangSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      required: [true, 'komoditas harus diisi'],
    },
    jumlahUsang: {
      type: Number,
      required: [true, 'jumlahUsang harus diisi'],
    },
    hargaJual: {
      type: Number,
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
