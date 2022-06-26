const Blanko = require('./model');
const User = require('../users/model');
const myFunction = require('../function/function');

module.exports = {
  createBlanko: async (req, res) => {
    try {
      console.log(req.userData.id);
      const { tanggalPencatatan, tipeCabai } = req.body;

      const user = req.userData.id;
      console.log(user);

      const blanko = await myFunction.cekBlanko(
        user,
        tanggalPencatatan,
        tipeCabai
      );

      if (blanko) {
        await myFunction.updateKolom5(user, tanggalPencatatan, tipeCabai);
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
