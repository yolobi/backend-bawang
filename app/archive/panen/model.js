const mongoose = require('mongoose');

const statusEnum = Object.freeze({
  diajukan: 0,
  ditolak: 1,
  diterima: 2,
});

let newtransaksiSchema = new mongoose.Schema(
  {
    tanggalPencatatan: {
      type: Date,
      required: [true, 'tanggalPencatatan harus diisi'],
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
      required: [true, 'tipeCabai harus diisi'],
    },
    jumlahDijual: {
      type: Number,
      required: [true, 'jumlahDijual harus diisi'],
    },
    hargaJual: {
      type: Number,
      required: [true, 'hargaJual harus diisi'],
    },
    pembeli: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    statusTransaksi: {
      type: Number,
      enum: Object.values(statusEnum),
      required: [true, 'statusTransaksi harus diisi'],
      default: statusEnum.diajukan,
    },
    alasanDitolak: {
      type: String,
      minlength: [6, 'alasan ditolak minimal 6 karakter'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newtransaksi', newtransaksiSchema);
