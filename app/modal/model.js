const mongoose = require('mongoose');

let modal = new mongoose.Schema(
  {
    lahan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lahan',
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Modal', modal);