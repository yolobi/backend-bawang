const mongoose = require('mongoose');

let penjualanSchema = new mongoose.Schema(
  {
    penjual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      require: true,
    },
    jumlahDijual: {
      type: String,
      require: true,
    },
    hargaJual: {
      type: Number,
      require: true,
    },
    pembeli: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    statusPenjualan: {
      type: String,
      enum: ['diajukan', 'diterima', 'ditolak'],
      require: true,
      default: 'diajukan',
    },
    alasanDitolak: {
      type: String,
      minlength: [6, 'alasan ditolak minimal 6 karakter'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Penjualan', penjualanSchema);
