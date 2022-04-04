const User = require('../users/model');

module.exports = {
  signup: async (req, res) => {
    try {
      const payload = req.body;

      let user = new User(payload);

      await user.save();
      res.status(201).json({
        message: "create user success",
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
};
