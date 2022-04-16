const Usang = require('./model');
const User = require('../users/model');

module.exports = {
  createUsang: async (req, res) => {
    try {
      console.log(req.userData.id);
      const {
        tipeCabai,
        jumlahUsang,
        hargaJual,
        tanggalPencatatan,
        pemanfaatan,
      } = req.body;

      const user = req.userData.id;
      console.log(user);

      let usang = new Usang({
        user,
        tipeCabai,
        jumlahUsang,
        hargaJual,
        tanggalPencatatan,
        pemanfaatan,
      });
      await usang.save();

      res.status(201).json({
        message: 'create usang success',
        data: usang,
      });
    } catch (error) {
      console.log(error);
    }
  },

  seeMyUsang: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myUsang = await Usang.find({ user: user }).select(
        '_id tipeCabai jumlahUsang hargaJual tanggalPencatatan pemanfaatan createdAt'
      );
      console.log(myUsang[0]);

      const countAllUsang = await Usang.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      if (myUsang[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada usang yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat data cabai usang',
          petani: userData,
          data: myUsang,
          countAllStok: countAllUsang,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  seeAUsang: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.usangId;
      console.log(user);

      const aUsang = await Usang.find({ user: user, _id: id });
      console.log(aUsang[0]);

      const userData = await User.findById(user).select('_id name role');

      if (aUsang[0] == undefined) {
        res.status(404).json({
          message: 'Data cabai usang tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat data cabai usang',
          petani: userData,
          data: aUsang,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  seeTipeUsang: async (req, res) => {
    try {
      const user = req.userData.id;
      const { tipeCabai } = req.body;
      console.log(user);

      const tipeUsang = await Usang.find({
        user: user,
        tipeCabai: tipeCabai,
      });
      console.log(tipeUsang[0]);

      const userData = await User.findById(user).select('_id name');

      if (tipeUsang[0] == undefined) {
        res.status(404).json({
          message: 'Data cabai usang tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Berhasil lihat data cabai usang untuk tipe ${tipeCabai}`,
          user: userData,
          data: tipeUsang,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteUsang: async (req, res) => {
    try {
      const id = req.params.usangId;
      const user = req.userData.id;
      console.log(user);

      const findUsang = Usang.findOne({ _id: id });

      if (findUsang && user) {
        const usang = await Usang.findOneAndRemove({ _id: id, user: user });
        res.status(201).json({
          message: 'Delete success',
          data: usang,
        });
      } else {
        res.status(404).json({
          message: 'Data cabai usang tidak ditemukan',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
