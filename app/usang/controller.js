const Usang = require('./model');
const User = require('../users/model');

module.exports = {
  addUsang: async (req, res) => {
    try {
      const { tipeCabai, jumlahUsang, tanggalPencatatan, pemanfaatan } =
        req.body;

      let idUser = req.userData.id;
      let jumlahUsangtoKg = jumlahUsang / 100;

      const newUsang = new Usang({
        user: idUser,
        tipeCabai,
        jumlahUsang: jumlahUsangtoKg.toFixed(3),
        tanggalPencatatan,
        pemanfaatan,
      });
      await newUsang.save();

      res.status(201).json({
        success: true,
        message: 'Berhasil menambahkan Cabai Usang',
        data: newUsang,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getUsangAll: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findUsang = await Usang.find({ user: idUser })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('user', '_id name role');

      const countAllUsang = findUsang.length;

      if (findUsang.length == 0 || !findUsang) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Cabai Usang yang diisi',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Cabai Usang',
          data: findUsang,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: true,
        message: error.message || `Internal server error`,
      });
    }
  },

  getUsangbyID: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idUsang = req.params.idUsang;

      const findUsang = await Usang.findOne({
        user: idUser,
        _id: idUsang,
      }).populate('user', '_id name role');

      if (!findUsang) {
        res.status(404).json({
          success: false,
          message: 'Data Cabai Usang tidak ditemukan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Cabai Usang',
          data: findUsang,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getUsangbyTipe: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const tipeCabai = req.params.tipecabai;

      const findUsang = await Usang.find({
        user: idUser,
        tipeCabai: tipeCabai,
      })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('user', '_id name role');
      console.log(findUsang);

      if (findUsang.length == 0 || !findUsang) {
        res.status(404).json({
          success: false,
          message: `Belum ada tipe ${tipeCabai} yang diisi`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Berhasil melihat data Cabai Usang untuk tipe ${tipeCabai}`,
          data: findUsang,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  deleteUsang: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idUsang = req.params.idUsang;

      const findUsang = await Usang.findOneAndRemove({
        user: idUser,
        _id: idUsang,
      }).populate('user', '_id name role');

      if (!findUsang) {
        res.status(404).json({
          success: false,
          message: 'Data Cabai Usang tidak ditemukan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil menghapus data Cabai Usang',
          data: findUsang,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },
};
