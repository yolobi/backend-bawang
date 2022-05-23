const mongoose = require('mongoose');

let blankoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tanggalPencatatan: {
      type: Date,
      required: [true, 'tanggalPencatatan harus diisi'],
      default: Date.now,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      required: [true, 'tipeCabai harus diisi'],
    },
    luasTanamanAkhirBulanLalu: {
      type: Number,
      required: [true, 'luasTanamanAkhirBulanLalu harus diisi'],
    },
    luasPanenHabis: {
      type: Number,
      required: [true, 'luasPanenHabis harus diisi'],
    },
    luasPanenBelumHabis: {
      type: Number,
      required: [true, 'luasPanenBelumHabis harus diisi'],
    },
    luasRusak: {
      type: Number,
      required: [true, 'luasRusak harus diisi'],
    },
    luasPenanamanBaru: {
      type: Number,
      required: [true, 'luasPenanamanBaru harus diisi'],
    },
    luasTanamanAkhirBulanLaporan: {
      type: Number,
      required: [true, 'luasTanamanAkhirBulanLaporan harus diisi'],
    },
    prodPanenHabis: {
      type: Number,
      required: [true, 'prodPanenHabis harus diisi'],
    },
    prodBelumHabis: {
      type: Number,
      required: [true, 'prodBelumHabis harus diisi'],
    },
    rataHargaJual: {
      type: Number,
      required: [true, 'rataHargaJual harus diisi'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blanko', blankoSchema);
