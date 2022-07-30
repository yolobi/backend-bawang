const Transaksi = require('./model');
const User = require('../../users/model');

const statusEnum = Object.freeze({
  diajukan: '0',
  ditolak: '1',
  diterima: '2',
});

module.exports = {
  createTransaksi: async (req, res) => {
    try {
      console.log(req.userData.id);
      const { tanggalPencatatan, tipeCabai, jumlahDijual, hargaJual, pembeli } =
        req.body;

      const penjual = req.userData.id;
      console.log(penjual);
      if (penjual == pembeli) {
        res.status(400).json({
          message: 'Tidak dapat melakukan penjualan terhadap diri sendiri',
        });
      }

      let transaksi = new Transaksi({
        tanggalPencatatan,
        tipeCabai,
        penjual,
        jumlahDijual,
        hargaJual,
        pembeli,
      });
      await transaksi.save();

      const dataPembeli = await User.findById(pembeli);

      res.status(201).json({
        message: 'Berhasil membuat Transaksi',
        id: transaksi._id,
        penjual: {
          id: req.userData.id,
          name: req.userData.name,
          role: req.userData.role,
        },
        tanggalPencatatan: tanggalPencatatan,
        tipeCabai: tipeCabai,
        jumlahDijual: jumlahDijual,
        hargaJual: hargaJual,
        pembeli: {
          id: dataPembeli._id,
          name: dataPembeli.name,
          role: dataPembeli.role,
        },
        statusTransaksi: statusEnum.diajukan,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seePedagang: async (req, res) => {
    try {
      const tipePedagang = req.params.tipepedagang;
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
          message: 'Bukan merupakan tipe akun Pedagang',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  changeStatusTerima: async (req, res) => {
    try {
      const id = req.params.transaksiId;
      if (!id) {
        res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      }

      const checkStatus = await Transaksi.findById(id);
      console.log(checkStatus.statusTransaksi);

      if (checkStatus.statusTransaksi == statusEnum.diajukan) {
        await Transaksi.findOneAndUpdate(
          { _id: id },
          { statusTransaksi: statusEnum.diterima, $unset: { alasanDitolak: 1 } }
        );

        res.status(200).json({
          message: 'Status Transaksi berhasil diubah',
          status: 'Transaksi diterima Pembeli',
          statusTransaksi: statusEnum.diterima,
        });
      } else {
        res.status(400).json({
          message: 'Harus mengajukan kembali Transaksi terlebih dahulu',
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
      const id = req.params.transaksiId;
      if (!id) {
        res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      }
      const { alasanDitolak } = req.body;

      const checkStatus = await Transaksi.findById(id);
      console.log(checkStatus.statusTransaksi);
      if (checkStatus.statusTransaksi == statusEnum.diterima) {
        res.status(400).json({
          message: 'Transaksi sudah diterima pembeli',
        });
      }
      if (checkStatus.statusTransaksi !== statusEnum.diterima) {
        await Transaksi.findOneAndUpdate(
          { _id: id },
          {
            statusTransaksi: statusEnum.ditolak,
            alasanDitolak: alasanDitolak,
          }
        );
        res.status(200).json({
          message: 'Status Transaksi berhasil diubah',
          status: 'Transaksi ditolak Pembeli',
          statusTransaksi: statusEnum.ditolak,
          alasanDitolak: alasanDitolak,
        });
      } else {
        res.status(404).json({
          message: 'Transaksi sudah diterima pembeli',
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
      const id = req.params.transaksiId;
      if (!id) {
        res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      }

      const { tipeCabai, jumlahDijual, hargaJual } = req.body;

      const checkStatus = await Transaksi.findById(id);
      console.log(checkStatus.statusTransaksi);

      if (checkStatus.statusTransaksi !== statusEnum.diterima) {
        const transaksi = await Transaksi.findOneAndUpdate(
          { _id: id },
          {
            tipeCabai,
            jumlahDijual,
            hargaJual,
            statusTransaksi: statusEnum.diajukan,
          }
        );
        res.status(200).json({
          message: 'Status Transaksi berhasil dirubah',
          status: 'Transaksi diajukan kembali ke Pembeli',
          statusTransaksi: statusEnum.diajukan,
          alasanDitolak: transaksi.alasanDitolak,
          data: transaksi,
        });
      } else {
        res.status(400).json({
          message: 'Transaksi sudah diterima pembeli',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
      console.log(error);
    }
  },

  seeMyTransaksi: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myTransaksi = await Transaksi.find({ penjual: user })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role');
      console.log(myTransaksi[0]);

      const countAllTransaksi = await Transaksi.find({
        penjual: user,
      }).countDocuments();

      const myBeliTransaksi = await Transaksi.find({ pembeli: user })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role');
      console.log(myTransaksi[0]);

      const countAllBeliTransaksi = await Transaksi.find({
        pembeli: user,
      }).countDocuments();

      const userData = await User.findById(user).select('_id name');

      if (myTransaksi[0] == undefined && myBeliTransaksi[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Transaksi yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat Transaksi',
          user: userData,
          dijual: myTransaksi,
          countAllJualTransaksi: countAllTransaksi,
          dibeli: myBeliTransaksi,
          countAllBeliTransaksi: countAllBeliTransaksi,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeATransaksi: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.transaksiId;
      console.log(user);

      const aTransaksi = await Transaksi.find({
        penjual: user,
        _id: id,
      })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role');
      console.log(aTransaksi[0]);

      const userData = await User.findById(user).select('_id name');

      if (aTransaksi[0] == undefined) {
        res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat Transaksi',
          user: userData,
          data: aTransaksi,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeTipeTransaksi: async (req, res) => {
    try {
      const user = req.userData.id;
      const tipeCabai = req.params.tipecabai;
      console.log(user);

      const tipeTransaksi = await Transaksi.find({
        penjual: user,
        tipeCabai: tipeCabai,
      })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role');
      console.log(tipeTransaksi[0]);

      const tipeBeliTransaksi = await Transaksi.find({
        pembeli: user,
        tipeCabai: tipeCabai,
      })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role');

      const userData = await User.findById(user).select('_id name');

      if (tipeTransaksi[0] == undefined && tipeBeliTransaksi[0] == undefined) {
        res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Berhasil melihat Transaksi untuk tipe ${tipeCabai}`,
          user: userData,
          dijual: tipeTransaksi,
          dibeli: tipeBeliTransaksi,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  deleteTransaksi: async (req, res) => {
    try {
      const id = req.params.transaksiId;
      const user = req.userData.id;
      console.log(user);

      const findTransaksi = await Transaksi.findOne({ _id: id });

      if (findTransaksi && user) {
        const transaksi = await Transaksi.findOneAndRemove({
          _id: id,
          user: user,
        })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role');
        res.status(201).json({
          message: 'Berhasil menghapus Transaksi',
          data: transaksi,
        });
      } else {
        res.status(404).json({
          message: 'Transaksi tidak ditemukan',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
