const Stok = require('./model');
const User = require('../users/model');

module.exports = {
  index: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      //   Stok CMB
      const stokCmb = await Stok.find({
        user: user,
        tipeCabai: 'cabaiMerahBesar',
      })
        .select(
          '_id tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual createdAt'
        )
        .sort({ createdAt: 'descending' });

      const countStokCmb = await Stok.find({
        user: user,
        tipeCabai: 'cabaiMerahBesar',
      }).countDocuments();

      //   stok CMK
      const stokCmk = await Stok.find({
        user: user,
        tipeCabai: 'cabaiMerahKeriting',
      })
        .select(
          '_id tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual createdAt'
        )
        .sort({ createdAt: 'descending' });

      const countStokCmk = await Stok.find({
        user: user,
        tipeCabai: 'cabaiMerahKeriting',
      }).countDocuments;

      //   Stok CRM
      const stokCrm = await Stok.find({
        user: user,
        tipeCabai: 'cabaiRawitMerah',
      })
        .select(
          '_id tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual createdAt'
        )
        .sort({ createdAt: 'descending' });

      const countStokCrm = await Stok.find({
        user: user,
        tipeCabai: 'cabaiRawitMerah',
      }).countDocuments();

      const myStok = await Stok.find({ user: user })
        .select(
          '_id tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual createdAt'
        )
        .sort({ createdAt: 'descending' });
      console.log(myStok[0]);

      const countAllStok = await Stok.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      res.status(200).json({
        message: 'Berhasil lihat data',
        petani: userData,
        stokCmb: stokCmb,
        countStokCmb: countStokCmb,
        stokCmk: stokCmk,
        countStokCmk: countStokCmk,
        stokCrm: stokCrm,
        countStokCrm: countStokCrm,
        riwayat: myStok,
        countAllStok: countAllStok,
      });
    } catch (error) {
      console.log(error);
    }
  },
  createStok: async (req, res) => {
    try {
      console.log(req.userData.id);
      const {
        tipeCabai,
        totalHasilPanen,
        hasilPanenSukses,
        hasilPanenGagal,
        hargaJual,
      } = req.body;

      const user = req.userData.id;
      console.log(user);

      let stok = new Stok({
        user,
        tipeCabai,
        totalHasilPanen,
        hasilPanenSukses,
        hasilPanenGagal,
        hargaJual,
      });
      await stok.save();

      res.status(201).json({
        message: 'create stok success',
        data: stok,
      });
    } catch (error) {
      console.log(error);
    }
  },

  seeMyStok: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myStok = await Stok.find({ user: user }).select(
        '_id tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual createdAt'
      );
      console.log(myStok[0]);

      const countAllStok = await Stok.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      if (myStok[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada stok yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat stok',
          petani: userData,
          data: myStok,
          countAllStok: countAllStok,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  seeAStok: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.stokId
      console.log(user);

      const aStok = await Stok.find({ user: user, _id: id })
      console.log(aStok[0]);

      const userData = await User.findById(user).select('_id name role');

      if (aStok[0] == undefined) {
        res.status(404).json({
          message: 'Stok tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat stok',
          petani: userData,
          data: aStok,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteStok: async (req, res) => {
    try {
      const id = req.params.idStok;
      const user = req.userData.id;
      console.log(user);

      const findStok = Stok.findOne({ _id: id });

      if (findStok && user) {
        const stok = await Stok.findOneAndRemove({ _id: id, user: user });
        res.status(201).json({
          message: 'Delete success',
          data: stok,
        });
      } else {
        res.status(404).json({
          message: 'Stok tidak ditemukan',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
