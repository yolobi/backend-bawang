const User = require('../users/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const myFunction = require('../function/function');
const Supervisi = require('../supervisi/model');

const RoleEnum = Object.freeze({
  petani: 'petani',
  agen: 'pedagang',
  distributor: 'pedagang',
  pengepul: 'pedagang',
  pengecer: 'pedagang',
  grosir: 'pedagang',
  pdh: 'pdh',
  dinasPetanianKota: 'dinas',
  dinasPertanianKabupaten: 'dinas',
});

module.exports = {
  signup: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        kecamatan,
        kabupaten,
        provinsi,
        alamat,
        role,
      } = req.body;

      // check if email is exist
      let isUserExist = await User.findOne({
        $or: [{ email: email }, { phone: phone }],
      });
      if (isUserExist) {
        return res.status(404).json({
          message: 'Akun sudah terdaftar',
        });
      }

      // password hashing
      const hashPassword = await bcrypt.hashSync(password, 10);

      const user = new User({
        name,
        email,
        phone,
        password: hashPassword,
        kecamatan,
        kabupaten,
        provinsi,
        alamat,
        role,
      });
      await user.save();

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        config.jwtKey
      );

      res.status(201).json({
        success: true,
        message: 'Berhasil membuat akun baru',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          access: RoleEnum[user.role],
        },
        token: token,
      });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
    }
  },

  signin: async (req, res) => {
    try {
      const { account, password } = req.body;

      const user = await User.findOne({
        $or: [{ email: account }, { phone: account }],
      });

      if (!user) {
        res.status(403).json({ message: 'Email belum terdaftar' });
      } else {
        const checkPassword = bcrypt.compareSync(password, user.password);

        if (checkPassword) {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
            },
            config.jwtKey
          );
          res.status(200).json({
            success: true,
            message: 'Sign-in Berhasil',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              access: RoleEnum[user.role],
            },
            token: token,
          });
        } else {
          res.status(403).json({
            message: 'Password yang dimasukkan Salah',
          });
        }
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
