const mongoose = require('mongoose');

let supervisiSchema = new mongoose.Schema(
  {
    petugas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    petani: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supervisi', supervisiSchema);
