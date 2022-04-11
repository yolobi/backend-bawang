const mongoose = require('mongoose');

let blankoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      require: true,
    },
    luasTanamanAkhirBulanLalu: {
      type: Number,
      require: true,
    },
    luasPanenHabis: {
      type: Number,
      require: true,
    },
    luasPanenBelumHabis: {
      type: Number,
      require: true,
    },
    luasRusak: {
      type: Number,
      require: true,
    },
    luasPenanamanBaru: {
      type: Number,
      require: true,
    },
    luasTanamanAkhirBulanLaporan: {
      type: Number,
      require: true,
    },
    prodPanenHabis: {
      type: Number,
      require: true,
    },
    prodBelumHabis: {
      type: Number,
      require: true,
    },
    rataHargaJual: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blanko', blankoSchema);
