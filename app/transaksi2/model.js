const mongoose = require('mongoose');

const statusEnum = Object.freeze({
  diajukan: 0,
  ditolak: 1,
  diterima: 2,
});

let transaksi2Schema = new mongoose.Schema(
  {
    lahan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lahan',
      required: true,
    },
    tanggalPencatatan: {
      type: Date,
      required: [true, 'tanggalPencatatan harus diisi'],
      default: Date.now,
    },
    hasilPanen: {
      type: Number,
      required: [true, 'hasilPanen harus diisi'],
    },
    hargaJual: {
      type: Number,
      required: [true, 'hargaJual harus diisi'],
    },
    grade: {
      type: String,
      enum: ['a', 'b', 'c', 'd'],
      required: [true, 'grade harus diisi'],
    },
    totalProduksi: {
      type: Number,
      required: [true, 'hargaJual harus diisi'],
    },
    penjual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

module.exports = mongoose.model('Transaksi2', transaksi2Schema);
