const mongoose = require('mongoose');

let blankoSchema = new mongoose.Schema(
  {
    jenisCabai: {
      type: String,
      enum: ['cabaiMerahBesar', 'cabaiMerahKeriting', 'cabaiRawitMerah'],
      require: true,
    },
    luasTanamanAkhirBulanLalu: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blanko', blankoSchema);
