const User = require('../users/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const myFunction = require('../function/function');

module.exports = {
  signup: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        kecamatan,
        kabupaten,
        provinsi,
        alamat,
        role,
      } = req.body;

      // check if email is exist
      let emailUser = await User.findOne({ email: email });
      if (emailUser) {
        return res.status(404).json({
          message: 'Email sudah terdaftar',
        });
      }

      // password hashing
      const hashPassword = await bcrypt.hashSync(password, 10);

      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        kecamatan: kecamatan,
        kabupaten: kabupaten,
        provinsi: provinsi,
        alamat: alamat,
        role: role,
      });
      await user.save();

      res.status(201).json({
        message: 'create user success',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          kecamatan: await myFunction.teritoryInfo(kecamatan),
          kabupaten: await myFunction.teritoryInfo(kabupaten),
          provinsi: await myFunction.teritoryInfo(provinsi),
          alamat: alamat,
          role: user.role,
        },
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

  signin: (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then((user) => {
      if (user) {
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            config.jwtKey
          );
          res.status(200).json({
            message: 'Signin success',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            token: token,
          });
        } else {
          res.status(403).json({
            message: 'Incorrect password',
          });
        }
      } else {
        res.status(403).json({
          message: 'Email not registered',
        });
      }
    });
  },
};
