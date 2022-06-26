const Blanko = require('./model');
const User = require('../users/model');
const myFunction = require('../function/function');
const Transaksi = require('../transaksi2/model');

module.exports = {
  createBlanko: async (req, res) => {
    try {
      const { tanggalPencatatan, tipeCabai } = req.body;

      const user = req.userData.id;

      const blanko = await myFunction.cekBlanko(
        user,
        tanggalPencatatan,
        tipeCabai
      );

      const transaksi = await Transaksi.findOne({ penjual: user });
      console.log(transaksi);

      if (!transaksi) {
        console.log('masuk ana');
        await myFunction.updateKolom8(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom4(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom9(user, tanggalPencatatan, tipeCabai);
        res.status(201).json({
          message: 'Berhasil menambahkan Blanko 1',
          data: blanko,
        });
      } else if (blanko) {
        console.log('masuk inituh');
        await myFunction.updateKolom7(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom8(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom4(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom10(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom11(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom12(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom5baru(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom6(user, tanggalPencatatan, tipeCabai);
        await myFunction.updateKolom9(user, tanggalPencatatan, tipeCabai);

        res.status(201).json({
          message: 'Berhasil menambahkan Blanko',
          data: blanko,
        });
      } else {
        res.status(400).json({
          message: 'Gagal menambahkan Blanko, Blanko telah dibuat',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeMyBlanko: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myBlanko = await Blanko.find({ user: user })
        .populate('user', '_id name role')
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        });
      console.log(myBlanko[0]);

      const userData = await User.findById(user).select('_id name role');

      if (myBlanko[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Blanko yang diinput',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat data Blanko',
          user: userData,
          data: myBlanko,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeABlanko: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.blankoId;
      console.log(user);

      const aBlanko = await Blanko.find({ user: user, _id: id });
      console.log(aBlanko[0]);

      const userData = await User.findById(user).select('_id name role');

      if (aBlanko[0] == undefined) {
        res.status(404).json({
          message: 'Blanko tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat Blanko yang telah diisi',
          user: userData,
          data: aBlanko,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  untuktestisng: async (req, res) => {
    try {
      const { tanggalPencatatan, tipeCabai } = req.body;

      const user = req.userData.id;

      await myFunction.updateKolom7(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom8(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom10(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom11(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom12(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom4(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom9(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom5baru(user, tanggalPencatatan, tipeCabai);
      await myFunction.updateKolom6(user, tanggalPencatatan, tipeCabai);

      res.status(200).json({ message: 'testing berhasil' });
    } catch (error) {}
  },

  //   seeTipeBlanko: async (req, res) => {
  //     try {
  //       const user = req.userData.id;
  //       const tipeCabai = req.params.tipecabai;
  //       console.log(user);

  //       const tipeBlanko = await Blanko.find({
  //         user: user,
  //         tipeCabai: tipeCabai,
  //       }).sort({
  //         tanggalPencatatan: 'descending',
  //         createdAt: 'descending',
  //       });

  //       const userData = await User.findById(user).select('_id name');

  //       if (tipeBlanko[0] == undefined) {
  //         res.status(404).json({
  //           message: 'Data Blanko tidak ditemukan',
  //         });
  //       } else {
  //         res.status(200).json({
  //           message: `Berhasil melihat data Blanko untuk tipe ${tipeCabai}`,
  //           user: userData,
  //           data: tipeBlanko,
  //         });
  //       }
  //     } catch (error) {
  //       res
  //         .status(500)
  //         .json({ message: error.message || `Internal server error` });
  //     }
  //   },

  //   deleteBlanko: async (req, res) => {
  //     try {
  //       const id = req.params.blankoId;
  //       const user = req.userData.id;
  //       console.log(user);

  //       const findBlanko = await Blanko.findOne({ _id: id });

  //       if (findBlanko && user) {
  //         const blanko = await Blanko.findOneAndRemove({ _id: id, user: user });
  //         res.status(201).json({
  //           message: 'Berhasil menghapus Blanko',
  //           data: blanko,
  //         });
  //       } else {
  //         res.status(404).json({
  //           message: 'Blanko tidak ditemukan',
  //         });
  //       }
  //     } catch (error) {
  //       res
  //         .status(500)
  //         .json({ message: error.message || `Internal server error` });
  //     }
  //   },
};
