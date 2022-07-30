const Blanko = require('../../archive/blanko/model');

module.exports = {
  // ---------------------- ADMIN ----------------------
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };

      const blanko = await Blanko.find().populate('user', '_id name');
      res.render('admin/blanko/viewBlanko', {
        blanko,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/blanko');
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render('admin/blanko/create');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/blanko');
    }
  },
  actionCreate: async (req, res) => {
    try {
      const {
        user,
        tanggalPencatatan,
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
        user,
        tanggalPencatatan,
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

      req.flash('alertMessage', 'Berhasil menambahkan blanko');
      req.flash('alertStatus', 'success');

      res.redirect('/admin/blanko');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/blanko');
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const blanko = await Blanko.findOne({ _id: id });
      console.log(blanko);

      res.render('admin/blanko/edit', { blanko });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/blanko');
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        user,
        tanggalPencatatan,
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

      await Blanko.findOneAndUpdate(
        { _id: id },
        {
          user,
          tanggalPencatatan,
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

      req.flash('alertMessage', 'Berhasil mengubah blanko');
      req.flash('alertStatus', 'success');

      res.redirect('/admin/blanko');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/blanko');
      console.log(error);
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Blanko.findOneAndRemove({ _id: id });

      req.flash('alertMessage', 'Berhasil menghapus blanko');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/blanko');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/blanko');
    }
  },
};
