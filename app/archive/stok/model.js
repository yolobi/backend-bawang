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
      required: [true, 'tanggalPencatatan harus diisi'],
      default: Date.now,
    },
    tipeCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      required: [true, 'tipeCabai harus diisi'],
    },
    totalHasilPanen: {
      type: Number,
      required: [true, 'totalHasilPanen harus diisi'],
    },
    hasilPanenSukses: {
      type: Number,
      required: [true, 'hasilPanenSukses harus diisi'],
    },
    hasilPanenGagal: {
      type: Number,
      required: [true, 'hasilPanenGagal harus diisi'],
    },
    hargaJual: {
      type: Number,
      required: [true, 'hargaJual harus diisi'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stok', stokSchema);
