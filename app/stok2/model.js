const mongoose = require('mongoose');

let stok2Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stokCMB: {
      type: Number,
    },
    stokCMK: {
      type: Number,
    },
    stokCRM: {
      type: Number,
    },
    stokBM: {
      type: Number,
    },
    stokBP: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stok2', stok2Schema);
