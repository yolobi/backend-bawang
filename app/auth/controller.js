const User = require('../users/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

const RoleEnum = Object.freeze({
  petani: 'petani',
  agen: 'pedagang',
  distributor: 'pedagang',
  pengepul: 'pedagang',
  pengecer: 'pedagang',
  grosir: 'pedagang',
  pdh: 'pdh',
  dinas: 'dinas',
  dinasPertanianKota: 'dinas',
  dinasPertanianKabupaten: 'dinas',
  dinasPertanianProvinsi: 'dinas',
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

      let isUserExist = null;

      if (email !== '') {
        isUserExist = await User.findOne({
          $or: [{ email: email }, { phone: phone }],
        });
      } else {
        isUserExist = await User.findOne({
          phone: phone,
        });
      }

      if (isUserExist) {
        return res.status(404).json({
          status: false,
          message: 'Akun sudah terdaftar',
        });
      }
      let user = null;
      // password hashing
      const hashPassword = await bcrypt.hashSync(password, 10);
      if (email !== '') {
        user = new User({
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
      } else {
        user = new User({
          name,
          email: null,
          phone,
          password: hashPassword,
          kecamatan,
          kabupaten,
          provinsi,
          alamat,
          role,
        });
      }
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

  login: async (req, res) => {
    try {
      const { account, password } = req.body;
      if (!account || !password)
        return res.status(404).json({
          success: false,
          message: 'Semua field wajib diisi',
        });

      const findUser = await User.findOne({
        $or: [{ email: account }, { phone: account }],
      });
      if (!findUser)
        return res.status(403).json({
          success: false,
          message: 'Email / No HP belum terdaftar',
        });

      const checkPassword = await bcrypt.compare(password, findUser.password);
      if (!checkPassword)
        return res.status(403).json({
          success: false,
          message: 'Password yang dimasukkan Salah',
        });

      const token = jwt.sign(
        {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          phone: findUser.phone,
          role: findUser.role,
        },
        config.jwtKey
      );

      res.status(200).json({
        success: true,
        message: 'Sign-in Berhasil',
        user: {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          phone: findUser.phone,
          role: findUser.role,
          access: RoleEnum[findUser.role],
        },
        token: token,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
