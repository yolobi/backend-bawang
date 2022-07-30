const Lahan = require('./model');
const User = require('../users/model');
const Transaksi2 = require('../transaksi2/model');
const myFunction = require('../function/function');

const statusEnum = Object.freeze({
  active: '0',
  finish: '1',
});

module.exports = {
  createLahan: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      let {
        tipeCabai,
        namaLahan,
        tanggalTanam,
        jumlahBatang,
        luasLahan,
        modalBenih,
        modalPupuk,
        modalPestisida,
        modalPekerja,
      } = req.body;

      const totalModal =
        Number(modalBenih) +
        Number(modalPupuk) +
        Number(modalPestisida) +
        Number(modalPekerja);

      let lahan = new Lahan({
        user,
        tipeCabai,
        namaLahan,
        tanggalTanam,
        jumlahBatang,
        luasLahan,
        modalBenih,
        modalPupuk,
        modalPestisida,
        modalPekerja,
        totalModal,
      });
      await lahan.save();

      res.status(201).json({
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

  addLuasRusak: async (req, res) => {
    try {
      const id = req.params.lahanId;
      const user = req.userData.id;
      console.log(user);
      console.log(id);

      const { luasRusak } = req.body;

      const persenRusak =
        (Number(luasRusak) / (await myFunction.luasLahan(id, user))) * 100;

      const lahanRusak = await Lahan.findOneAndUpdate(
        { _id: id },
        { $set: { luasRusak: luasRusak, persenRusak: persenRusak } },
        { new: true }
      );
      console.log(lahanRusak);

      res.status(201).json({
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
      const { modalBenih, modalPupuk, modalPestisida, modalPekerja } = req.body;
      const totalModal =
        Number(modalBenih) +
        Number(modalPupuk) +
        Number(modalPestisida) +
        Number(modalPekerja);

      const hasilUpdate = await Lahan.findOneAndUpdate(
        { _id: req.params.lahanId, user: req.userData.id },
        {
          $set: {
            modalBenih: modalBenih,
            modalPupuk: modalPupuk,
            modalPestisida: modalPestisida,
            modalPekerja: modalPekerja,
            totalModal: totalModal,
          },
        },
        { new: true }
      );

      if (!hasilUpdate) {
        res.status(400).json({
          sucess: false,
          message: 'ID Lahan tidak ditemukan',
        });
      } else {
        await myFunction.updateKeuntungan(req.params.lahanId, req.userData.id);
        res.status(201).json({
          success: true,
          message: 'Berhasil mengedit modal',
          data: hasilUpdate,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  seeNameLahan: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myLahan = await Lahan.find({ user: user })
        .select('_id namaLahan tanggalTanam')
        .sort({
          tanggalTanam: 'descending',
          createdAt: 'descending',
        });

      const userData = await User.findById(user).select('_id name role');

      if (myLahan[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat data Lahan',
          petani: userData,
          data: myLahan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  seeMyLahan: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myLahan = await Lahan.find({ user: user })
        .select(
          '_id namaLahan tipeCabai jumlahPanen rataanJumlahPanen transaksi jumlahPenjualan rataanHargaJual jumlahBatang tanggalTanam tanggalSelesai createdAt'
        )
        .populate('transaksi', '_id totalProduksi')
        .sort({
          tanggalTanam: 'descending',
          createdAt: 'descending',
        });
      console.log(myLahan[0]);

      const userData = await User.findById(user).select('_id name role');

      if (myLahan[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat data Lahan',
          user: userData,
          data: myLahan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  seeMyTipeLahan: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myLahan = await Lahan.distinct('tipeCabai', { user: user });
      // console.log(myLahan[0]);

      const userData = await User.findById(user).select('_id name role');

      if (myLahan[0] == undefined) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat Tipe Cabai Lahan',
          user: userData,
          data: myLahan,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  seeALahan: async (req, res) => {
    try {
      const findLahan = await Lahan.findOne({
        user: req.userData.id,
        _id: req.params.lahanId,
      })
        .populate({
          path: 'transaksi',
          select: '_id jumlahDijual hargaJual totalProduksi statusTransaksi',
          match: { statusTransaksi: 2 },
        })
        .populate('user', '_id name role');

      const toRes = findLahan.toObject();
      toRes.countTransaksi = findLahan.transaksi.length;

      if (!findLahan) {
        res.status(404).json({
          success: false,
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
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

  lahanFinish: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.lahanId;
      console.log(user);

      const { tanggalSelesai } = req.body;

      if (!tanggalSelesai) {
        res.status(404).json({
          message: 'tanggal selesai harus diisi',
        });
      }

      const aLahan = await Lahan.findOneAndUpdate(
        { user: user, _id: id },
        { tanggalSelesai: tanggalSelesai }
      );

      if (!aLahan) {
        res.status(404).json({
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Lahan dengan nama ${aLahan.namaLahan} telah selesai`,
          tanggalSelesai: tanggalSelesai,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  lahanUnfinish: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.lahanId;
      console.log(user);

      const aLahan = await Lahan.findOneAndUpdate(
        { user: user, _id: id },
        { tanggalSelesai: null }
      );

      if (!aLahan) {
        res.status(404).json({
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Lahan dengan nama ${aLahan.namaLahan} berhasil diubah menjadi belum selesai`,
          tanggalSelesai: null,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  deleteLahan: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.lahanId;
      console.log(user);

      const userData = await User.findById(user).select('_id name role');
      const aLahan = await Lahan.findOneAndRemove({ user: user, _id: id });

      if (!aLahan) {
        res.status(404).json({
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        await Transaksi2.deleteMany({ lahan: id });

        res.status(200).json({
          message: `Lahan dengan nama ${aLahan.namaLahan} berhasil dihapus`,
          user: userData,
          data: aLahan,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
