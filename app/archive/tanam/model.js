const mongoose = require('mongoose');

const statusEnum = Object.freeze({
  active: '0',
  finish: '1',
});

let tanamSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tanggalPenanaman: {
      type: Date,
      required: [true, 'tanggalPenanaman harus diisi'],
      default: Date.now,
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
    jumlahTanam: {
      type: Number,
      required: [true, 'jumlahTanam harus diisi'],
    },
    statusLahan: {
      type: Number,
      enum: Object.values(statusEnum),
      required: [true, 'statusTransaksi harus diisi'],
      default: statusEnum.active,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tanam', tanamSchema);
