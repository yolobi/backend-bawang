const mongoose = require('mongoose');

// const statusEnum = Object.freeze({
//   active: '0',
//   finish: '1',
// });

let lahanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transaksi: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Transaksi2',
      required: true,
    },
    jumlahBatang: {
      type: Number,
      required: [true, 'jumlahBatang harus diisi'],
    },
    luasLahan: {
      type: Number,
      required: [true, 'luasLahan harus diisi'],
    },
    tanggalTanam: {
      type: Date,
    },
    tanggalMulaiPanen: {
      type: Date,
      default: null,
    },
    tanggalSelesai: {
      type: Date,
      default: null,
    },
    persenRusak: {
      type: Number,
      default: 0,
    },
    luasRusak: {
      type: Number,
      default: 0,
    },
    rataanJumlahPanen: {
      type: Number,
      default: 0,
    },
    jumlahPanen: {
      type: Number,
      default: 0,
    },
    rataanHargaJual: {
      type: Number,
      default: 0,
    },
    jumlahPenjualan: {
      type: Number,
      default: 0,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      required: [true, 'tipeCabai harus diisi'],
    },
    namaLahan: {
      type: String,
      required: [true, 'namaLahan harus diisi'],
    },
    modalBenih: {
      type: Number,
      default: 0,
    },
    modalPupuk: {
      type: Number,
      default: 0,
    },
    modalPestisida: {
      type: Number,
      default: 0,
    },
    modalPekerja: {
      type: Number,
      default: 0,
    },
    totalModal: {
      type: Number,
      default: 0,
    },
    keuntungan: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lahan', lahanSchema);
