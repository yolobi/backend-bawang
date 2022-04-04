const User = require('../users/model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = req.body;

      let user = new User(payload);

      await user.save();
      res.status(201).json({
        message: 'create user success',
        data: user,
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
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
            },
            config.jwtKey
          );
          res.status(200).json({
            message: 'Signin success',
            data: { token },
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
