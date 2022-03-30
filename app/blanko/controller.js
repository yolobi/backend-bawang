const Blanko = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      res.render('admin/blanko/viewBlanko');
    } catch (err) {
      console.log(err);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render('admin/blanko/create');
    } catch (error) {}
  },
  actionCreate: async (req, res) => {
    try {
      const { jenisCabai, luasTanamanAkhirBulanLalu } = req.body;

      let blanko= new Blanko({ jenisCabai, luasTanamanAkhirBulanLalu });
      await blanko.save();

      res.redirect('/blanko');
    } catch (error) {
      console.log(error);
    }
  },
};
