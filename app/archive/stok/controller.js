const Stok = require('./model');
const User = require('../../users/model');

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
          '_id tanggalPencatatan tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual'
        )
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .limit(5);

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
          '_id tanggalPencatatan tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual'
        )
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .limit(5);

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
          '_id tanggalPencatatan tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual'
        )
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .limit(5);

      const countStokCrm = await Stok.find({
        user: user,
        tipeCabai: 'cabaiRawitMerah',
      }).countDocuments();

      const myStok = await Stok.find({ user: user })
        .select(
          '_id tanggalPencatatan tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual'
        )
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .limit(5);
      console.log(myStok[0]);

      const countAllStok = await Stok.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      res.status(200).json({
        message: 'Berhasil melihat data Stok',
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
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
  createStok: async (req, res) => {
    try {
      console.log(req.userData.id);
      const {
        tanggalPencatatan,
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
        tanggalPencatatan,
        tipeCabai,
        totalHasilPanen,
        hasilPanenSukses,
        hasilPanenGagal,
        hargaJual,
      });
      await stok.save();

      res.status(201).json({
        message: 'Berhasil menambahkan Stok',
        data: stok,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeMyStok: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myStok = await Stok.find({ user: user })
        .select(
          '_id tanggalPencatatan tipeCabai totalHasilPanen hasilPanenSukses hasilPanenGagal hargaJual'
        )
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        });
      console.log(myStok[0]);

      const countAllStok = await Stok.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      if (myStok[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Stok yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat Stok',
          petani: userData,
          data: myStok,
          countAllStok: countAllStok,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeAStok: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.stokId;
      console.log(user);

      const aStok = await Stok.find({ user: user, _id: id });
      console.log(aStok[0]);

      const userData = await User.findById(user).select('_id name role');

      if (aStok[0] == undefined) {
        res.status(404).json({
          message: 'Stok tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat Stok',
          petani: userData,
          data: aStok,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeTipeStok: async (req, res) => {
    try {
      const user = req.userData.id;
      const tipeCabai = req.params.tipecabai;
      console.log(user);

      const tipeStok = await Stok.find({
        user: user,
        tipeCabai: tipeCabai,
      }).sort({
        tanggalPencatatan: 'descending',
        createdAt: 'descending',
      });
      console.log(tipeStok[0]);

      const userData = await User.findById(user).select('_id name');

      if (tipeStok[0] == undefined) {
        res.status(404).json({
          message: 'Data Stok tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Berhasil melihat data Stok untuk tipe ${tipeCabai}`,
          user: userData,
          data: tipeStok,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  deleteStok: async (req, res) => {
    try {
      const id = req.params.stokId;
      const user = req.userData.id;
      console.log(user);

      const findStok = await Stok.findOne({ _id: id });

      if (findStok && user) {
        const stok = await Stok.findOneAndRemove({ _id: id, user: user });
        res.status(201).json({
          message: 'Berhasil menghapus Stok',
          data: stok,
        });
      } else {
        res.status(404).json({
          message: 'Stok tidak ditemukan',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
