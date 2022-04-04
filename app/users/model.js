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
      require: true,
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

// Email Count Validation
userSchema.path('email').validate(async function (value){
    try {
        const count = await this.model('User').countDocuments({email: value})
        return !count
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} sudah terdaftar`)

// Password Hash
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = mongoose.model('User', userSchema);
