const Penjualan = require('./model');
const User = require('../users/model');

module.exports = {
  createPenjualan: async (req, res) => {
    try {
      console.log(req.userData.id);
      const { tipeCabai, jumlahDijual, hargaJual, pembeli } = req.body;

      const penjual = req.userData.id;
      console.log(penjual);

      let penjualan = new Penjualan({
        tipeCabai,
        penjual,
        jumlahDijual,
        hargaJual,
        pembeli,
      });
      await penjualan.save();

      const dataPembeli = await User.findById(pembeli);

      res.status(201).json({
        message: 'berhasil buat penjualan',
        id: penjualan._id,
        penjual: {
          id: req.userData.id,
          name: req.userData.name,
          role: req.userData.role,
        },
        tipeCabai: tipeCabai,
        jumlahDijual: jumlahDijual,
        hargaJual: hargaJual,
        pembeli: {
          id: dataPembeli._id,
          name: dataPembeli.name,
          role: dataPembeli.role,
        },
        statusPenjualan: 'diajukan',
        createdAt: penjualan.createdAt,
      });
    } catch (error) {
      console.log(error);
    }
  },

  seePedagang: async (req, res) => {
    try {
      const { tipePedagang } = req.body;
      console.log(tipePedagang);

      let pedagang = ['pengepul', 'pengecer', 'distributor', 'agen', 'grosir'];
      let isPedagang = pedagang.includes(tipePedagang);

      if (isPedagang) {
        const dataPedagang = await User.find({ role: tipePedagang }).select(
          '_id name'
        );
        res.status(200).json({
          tipePedagang: tipePedagang,
          pedagang: dataPedagang,
        });
      } else {
        res.status(404).json({
          message: 'bukan tipe pedagang',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  changeStatusTerima: async (req, res) => {
    try {
      const id = req.params.penjualanId;
      if (!id) {
        res.status(404).json({
          message: 'Penjualan tidak ditemukan',
        });
      }

      const checkStatus = await Penjualan.findById(id);
      console.log(checkStatus.statusPenjualan);

      if (checkStatus.statusPenjualan == 'diajukan') {
        await Penjualan.findOneAndUpdate(
          { _id: id },
          { statusPenjualan: 'diterima', $unset: { alasanDitolak: 1 } }
        );

        res.status(200).json({
          message: 'Status Penjualan berhasil dirubah',
          status: 'Penjualan  diterima Pembeli',
          statusPenjualan: 'diterima',
        });
      } else {
        res.status(404).json({
          message: 'Harus ajukan kembali terlebih dahulu',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
      console.log(error);
    }
  },

  changeStatusTolak: async (req, res) => {
    try {
      const id = req.params.penjualanId;
      if (!id) {
        res.status(404).json({
          message: 'Penjualan tidak ditemukan',
        });
      }
      const { alasanDitolak } = req.body;

      const checkStatus = await Penjualan.findById(id);
      console.log(checkStatus.statusPenjualan);

      if (checkStatus.statusPenjualan !== 'diterima') {
        await Penjualan.findOneAndUpdate(
          { _id: id },
          { statusPenjualan: 'ditolak', alasanDitolak: alasanDitolak }
        );
        res.status(200).json({
          message: 'Status Penjualan berhasil dirubah',
          status: 'Penjualan  ditolak Pembeli',
          statusPenjualan: 'ditolak',
          alasanDitolak: alasanDitolak,
        });
      } else {
        res.status(404).json({
          message: 'Penjualan sudah diterima pembeli',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
      console.log(error);
    }
  },

  changeStatusAjukan: async (req, res) => {
    try {
      const id = req.params.penjualanId;
      if (!id) {
        res.status(404).json({
          message: 'Penjualan tidak ditemukan',
        });
      }

      const { tipeCabai, jumlahDijual, hargaJual } = req.body;

      const checkStatus = await Penjualan.findById(id);
      console.log(checkStatus.statusPenjualan);

      if (checkStatus.statusPenjualan == 'ditolak') {
        const penjualan = await Penjualan.findOneAndUpdate(
          { _id: id },
          { tipeCabai, jumlahDijual, hargaJual, statusPenjualan: 'diajukan' }
        );
        res.status(200).json({
          message: 'Status Penjualan berhasil dirubah',
          status: 'Penjualan  diajukan kembali ke Pembeli',
          statusPenjualan: 'diajukan',
          alasanDitolak: penjualan.alasanDitolak,
          data: penjualan,
        });
      } else {
        res.status(404).json({
          message: 'Penjualan sudah diterima pembeli',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
      console.log(error);
    }
  },

  seePenjualan: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myPenjualan = await Penjualan.find({ user: user }).populate(
        'pembeli',
        '_id name role'
      );
      console.log(myPenjualan[0]);

      const countAllPenjualan = await Penjualan.find({
        user: user,
      }).countDocuments();

      const userData = await User.findById(user).select('_id name');

      if (myPenjualan[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Penjualan yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat Penjualan',
          user: userData,
          data: myPenjualan,
          countAllPenjualan: countAllPenjualan,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  seeAPenjualan: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.penjualanId;
      console.log(user);

      const aPenjualan = await Penjualan.find({ user: user, _id: id }).populate(
        'pembeli',
        '_id name role'
      );
      console.log(aPenjualan[0]);

      const userData = await User.findById(user).select('_id name');

      if (aPenjualan[0] == undefined) {
        res.status(404).json({
          message: 'Penjualan tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil lihat Penjualan',
          user: userData,
          data: aPenjualan,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  seeTipePenjualan: async (req, res) => {
    try {
      const user = req.userData.id;
      const { tipeCabai } = req.body;
      console.log(user);

      const tipePenjualan = await Penjualan.find({
        user: user,
        tipeCabai: tipeCabai,
      }).populate('pembeli', '_id name role');
      console.log(tipePenjualan[0]);

      const userData = await User.findById(user).select('_id name');

      if (tipePenjualan[0] == undefined) {
        res.status(404).json({
          message: 'Penjualan tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Berhasil lihat Penjualan untuk tipe ${tipeCabai}`,
          user: userData,
          data: tipePenjualan,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  deletePenjualan: async (req, res) => {
    try {
      const id = req.params.penjualanId;
      const user = req.userData.id;
      console.log(user);

      const findPenjualan = await Penjualan.findOne({ _id: id });

      if (findPenjualan && user) {
        const penjualan = await Penjualan.findOneAndRemove({
          _id: id,
          user: user,
        })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role');
        res.status(201).json({
          message: 'Delete success',
          data: penjualan,
        });
      } else {
        res.status(404).json({
          message: 'Penjualan tidak ditemukan',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
