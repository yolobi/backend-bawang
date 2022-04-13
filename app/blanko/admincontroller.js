const Blanko = require('./model');

module.exports = {
  // ---------------------- ADMIN ----------------------
  index: async (req, res) => {
    try {
      const blanko = await Blanko.find();
      res.render('admin/blanko/viewBlanko', {
        blanko,
      });
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
      const {
        tipeCabai,
        luasTanamanAkhirBulanLalu,
        luasPanenHabis,
        luasPanenBelumHabis,
        luasRusak,
        luasPenanamanBaru,
        luasTanamanAkhirBulanLaporan,
        prodBelumHabis,
        prodPanenHabis,
        rataHargaJual,
      } = req.body;

      let blanko = new Blanko({
        tipeCabai,
        luasTanamanAkhirBulanLalu,
        luasPanenHabis,
        luasPanenBelumHabis,
        luasRusak,
        luasPenanamanBaru,
        luasTanamanAkhirBulanLaporan,
        prodBelumHabis,
        prodPanenHabis,
        rataHargaJual,
      });
      await blanko.save();

      res.redirect('/blanko');
    } catch (error) {
      console.log(error);
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const blanko = await Blanko.findOne({ _id: id });
      console.log(blanko);

      res.render('admin/blanko/edit', { blanko });
    } catch (error) {
      console.log(error);
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        tipeCabai,
        luasTanamanAkhirBulanLalu,
        luasPanenHabis,
        luasPanenBelumHabis,
        luasRusak,
        luasPenanamanBaru,
        luasTanamanAkhirBulanLaporan,
        prodBelumHabis,
        prodPanenHabis,
        rataHargaJual,
      } = req.body;

      const blanko = await Blanko.findOneAndUpdate(
        { _id: id },
        {
          tipeCabai,
          luasTanamanAkhirBulanLalu,
          luasPanenHabis,
          luasPanenBelumHabis,
          luasRusak,
          luasPenanamanBaru,
          luasTanamanAkhirBulanLaporan,
          prodBelumHabis,
          prodPanenHabis,
          rataHargaJual,
        }
      );
      console.log(blanko);

      res.redirect('/blanko');
    } catch (error) {
      console.log(error);
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const blanko = await Blanko.findOneAndRemove({ _id: id });
      res.redirect('/blanko');
    } catch (error) {
      console.log(error);
    }
  },
};
