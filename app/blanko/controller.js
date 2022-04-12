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

  // ---------------------- API ----------------------
  allBlanko: async (req, res) => {
    try {
      const blanko = await Blanko.find().populate(
        'user',
        '_id email name role'
      );
      res.status(200).json({
        message: 'Berhasil',
        data: blanko,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createBlanko: async (req, res) => {
    try {
      console.log(req.userData.id);
      const {
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

      const user = req.userData.id;
      console.log(user);

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

      res.status(201).json({
        message: 'create blanko success',
        data: blanko,
      });
    } catch (error) {
      console.log(error);
    }
  },

  editBlanko: async (req, res) => {
    try {
      const id = req.params;
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

      const user = req.userData.id;
      console.log(user);

      const blanko = await Blanko.findOneAndUpdate(
        { user: user, _id: id },
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
      console.log({
        oldBlanko: blanko,
      });

      const newBlanko = await Blanko.findById(id);
      console.log({
        newBlanko: newBlanko,
      });

      res.status(201).json({
        message: 'Update success',
        data: newBlanko,
      });
    } catch (error) {
      console.log(error);
    }
  },

  seeMyBlanko: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myBlanko = await Blanko.find({ user: user }).populate(
        'user',
        '_id email name role'
      );
      console.log(myBlanko[0]);

      if (myBlanko[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada blanko yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil',
          data: myBlanko,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteBlanko: async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.userData.id;
      console.log(user);

      const findBlanko = await Blanko.findOne({ _id: id });

      if (findBlanko && user) {
        const blanko = await Blanko.findOneAndRemove({ _id: id, user: user });
        res.status(201).json({
          message: 'Delete success',
          data: blanko,
        });
      } else {
        res.status(404).json({
          message: 'Blanko tidak ditemukan',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  
};
