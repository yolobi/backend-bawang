const mongoose = require('mongoose');

let stokSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tanggalPencatatan: {
      type: Date,
      require: true,
      default: Date.now,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      require: true,
    },
    totalHasilPanen: {
      type: Number,
      require: true,
    },
    hasilPanenSukses: {
      type: Number,
      require: true,
    },
    hasilPanenGagal: {
      type: Number,
      require: true,
    },
    hargaJual: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stok', stokSchema);
