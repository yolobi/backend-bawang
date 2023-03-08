const mongoose = require('mongoose');

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
    jenisPupuk: {
      type: String,
      enum: ['urea', 'tsp', 'za', 'npk', 'npkKhusus', 'organik', 'organikCair'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lahan', lahanSchema);
