const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HASH_ROUND = 10;

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email',
      },
      required: [true, 'Email required'],
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: [
        'petani',
        'agen',
        'distributor',
        'pengecer',
        'pengepul',
        'pdh',
        'dinasPertanianKota',
        'dinasPertanianProvinsi',
      ],
      require: true,
    },
  },
  { timestamps: true }
);


// Password Hash
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = mongoose.model('User', userSchema);
