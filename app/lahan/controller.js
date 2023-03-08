const Lahan = require('./model');
const User = require('../users/model');
const Transaksi2 = require('../transaksi2/model');
const myFunction = require('../function/function');

const statusEnum = Object.freeze({
  active: '0',
  finish: '1',
});

module.exports = {
  addLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;

      let {
        komoditas,
        namaLahan,
        tanggalTanam,
        jumlahBatang,
        luasLahan,
        modalBenih,
        modalPupuk,
        modalPestisida,
        modalPekerja,
        jenisPupuk,
      } = req.body;

      const totalModal =
        Number(modalBenih) +
        Number(modalPupuk) +
        Number(modalPestisida) +
        Number(modalPekerja);

      let lahan = new Lahan({
        user: idUser,
        komoditas,
        namaLahan,
        tanggalTanam,
        jumlahBatang,
        luasLahan,
        modalBenih,
        modalPupuk,
        modalPestisida,
        modalPekerja,
        jenisPupuk,
        totalModal: totalModal.toFixed(3),
      });
      await lahan.save();

      res.status(201).json({
        success: true,
        message: 'Berhasil menambahkan Lahan',
        data: lahan,
      });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  editLuasRusak: async (req, res) => {
    try {
      const idLahan = req.params.idLahan;
      const idUser = req.userData.id;

      const { luasRusak } = req.body;

      const findLahan = await Lahan.findOne({
        _id: idLahan,
        user: idUser,
      }).select('_id luasLahan');

      if (!findLahan)
        return res.status(404).json({
          success: false,
          message: 'Lahan tidak ditemukan',
        });

      const persenRusak =
        (Number(luasRusak) / Number(findLahan.luasLahan)) * 100;

      const lahanRusak = await Lahan.findOneAndUpdate(
        { _id: idLahan },
        { luasRusak: luasRusak, persenRusak: persenRusak.toFixed(3) },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: 'Berhasil menambahkan Luas Lahan Rusak dalam hektar',
        data: lahanRusak,
      });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  editModal: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idLahan = req.params.idLahan;

      const { modalBenih, modalPupuk, modalPestisida, modalPekerja } = req.body;

      let totalModal =
        Number(modalBenih) +
        Number(modalPupuk) +
        Number(modalPestisida) +
        Number(modalPekerja);

      const updateModal = await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        {
          modalBenih: Number(modalBenih).toFixed(3),
          modalPupuk: Number(modalPupuk).toFixed(3),
          modalPestisida: Number(modalPestisida).toFixed(3),
          modalPekerja: Number(modalPekerja).toFixed(3),
          totalModal: totalModal.toFixed(3),
        },
        { new: true }
      );

      if (!updateModal) {
        res.status(400).json({
          sucess: false,
          message: 'Lahan tidak ditemukan',
        });
      } else {
        console.log('sini yu');
        const updateLahan = await myFunction.updateDataLahan(idLahan, idUser);
        console.log(updateLahan);

        res.status(201).json({
          success: true,
          message: 'Berhasil mengedit modal',
          data: updateLahan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getLahanAll: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findLahan = await Lahan.find({ user: idUser })
        .populate('transaksi', '_id totalProduksi')
        .populate('user', 'id name role')
        .sort({
          tanggalTanam: 'descending',
          createdAt: 'descending',
        });

      if (findLahan.length == 0 || !findLahan) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Lahan yang dibuat',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Lahan',
          data: findLahan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getLahanbyID: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idLahan = req.params.idLahan;

      const findLahan = await Lahan.findOne({
        user: idUser,
        _id: idLahan,
      })
        .populate({
          path: 'transaksi',
          select: '_id jumlahDijual hargaJual totalProduksi statusTransaksi',
          match: { statusTransaksi: 2 },
        })
        .populate('user', '_id name role');

      if (!findLahan) {
        res.status(404).json({
          success: false,
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        const toRes = findLahan.toObject();
        toRes.countTransaksi = findLahan.transaksi.length;
        res.status(200).json({
          success: true,
          message: `Berhasil melihat data Lahan dengan nama ${findLahan.namaLahan}`,
          data: toRes,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getKomoditasfromLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findLahan = await Lahan.distinct('komoditas', { user: idUser });
      console.log(findLahan);

      if (findLahan[0] == undefined) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        const userDetail = await User.findById(idUser).select('_id name role');
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Tipe Cabai Lahan',
          user: userDetail,
          data: findLahan,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getPupukfromLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findLahan = await Lahan.distinct('jenisPupuk', { user: idUser });
      console.log(findLahan);

      if (findLahan[0] == undefined) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        const userDetail = await User.findById(idUser).select('_id name role');
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Jenis Pupuk Lahan',
          user: userDetail,
          data: findLahan,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getNamafromLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findLahan = await Lahan.find({ user: idUser })
        .select('_id namaLahan tanggalTanam')
        .sort({
          tanggalTanam: 'descending',
          createdAt: 'descending',
        })
        .populate('user', '_id name role');

      if (findLahan.length == 0 || !findLahan) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Lahan',
          data: findLahan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  editFinishLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idLahan = req.params.idLahan;

      const { tanggalSelesai } = req.body;
      console.log(Boolean(tanggalSelesai));
      if (!tanggalSelesai) {
        res.status(404).json({
          succes: false,
          message: 'tanggal selesai harus diisi',
        });
      } else {
        const findLahan = await Lahan.findOneAndUpdate(
          { user: idUser, _id: idLahan },
          { tanggalSelesai: tanggalSelesai }
        );

        if (!findLahan) {
          res.status(404).json({
            success: false,
            message: 'Data Lahan tidak ditemukan',
          });
        } else {
          res.status(200).json({
            success: true,
            message: `Lahan dengan nama ${findLahan.namaLahan} telah selesai`,
            tanggalSelesai: tanggalSelesai,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  editActivateLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idLahan = req.params.idLahan;

      const findLahan = await Lahan.findOneAndUpdate(
        { user: idUser, _id: idLahan },
        { tanggalSelesai: null }
      );

      if (!findLahan) {
        res.status(404).json({
          success: false,
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Lahan dengan nama ${findLahan.namaLahan} berhasil diaktifkan kembali`,
          tanggalSelesai: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  deleteLahan: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idLahan = req.params.idLahan;

      const findLahan = await Lahan.findOneAndRemove({
        user: idUser,
        _id: idLahan,
      }).populate('user', '_id name role');

      if (!findLahan) {
        res.status(404).json({
          success: 'false',
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        await Transaksi2.deleteMany({ lahan: idLahan });

        res.status(200).json({
          success: true,
          message: `Lahan dengan nama ${findLahan.namaLahan} berhasil dihapus`,
          data: findLahan,
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
