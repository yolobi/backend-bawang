const Blanko = require('./model');
const User = require('../users/model');

module.exports = {
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

  seeMyBlanko: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myBlanko = await Blanko.find({ user: user });
      console.log(myBlanko[0]);

      const countAllBlanko = await Blanko.find({
        user: user,
      }).countDocuments();

      const userData = await User.findById(user).select('_id name');

      if (myBlanko[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada blanko yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat blanko',
          user: userData,
          data: myBlanko,
          countAllBlanko: countAllBlanko,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  seeABlanko: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.blankoId
      console.log(user);

      const aBlanko = await Blanko.find({user: user, _id: id });
      console.log(aBlanko[0]);

      const userData = await User.findById(user).select('_id name');

      if (aBlanko[0] == undefined) {
        res.status(404).json({
          message: 'Blanko tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat blanko',
          user: userData,
          data: aBlanko,
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
