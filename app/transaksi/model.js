const mongoose = require('mongoose');

const statusEnum = Object.freeze({
  diajukan : 0,
  ditolak: 1,
  diterima: 2,
});

let transaksiSchema = new mongoose.Schema(
  {
    tanggalPencatatan: {
      type: Date,
      require: true,
      default: Date.now,
    },
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
      type: Number,
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
    statusTransaksi: {
      type: Number,
      enum: Object.values(statusEnum),
      require: true,
      default: statusEnum.diajukan,
    },
    alasanDitolak: {
      type: String,
      minlength: [6, 'alasan ditolak minimal 6 karakter'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaksi', transaksiSchema);
