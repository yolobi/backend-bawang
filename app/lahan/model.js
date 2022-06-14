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
    },
    tanggalSelesai: {
      type: Date,
    },
    persenRusak: {
      type: Number,
    },
    luasRusak: {
      type: Number,
    },
    rataanJumlahPanen: {
      type: Number,
    },
    jumlahPanen: {
      type: Number,
      default: 0,
    },
    rataanHargaJual: {
      type: Number,
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
    jumlahBenih: {
      type: Number,
    },
    hargaBenih: {
      type: Number,
    },
    jumlahPupuk: {
      type: Number,
    },
    hargaPupuk: {
      type: Number,
    },
    jumlahPestisida: {
      type: Number,
    },
    hargaPestisida: {
      type: Number,
    },
    jumlahPekerja: {
      type: Number,
    },
    hargaPekerja: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lahan', lahanSchema);
