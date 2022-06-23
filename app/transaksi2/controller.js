const Transaksi2 = require('./model');
const User = require('../users/model');
const Lahan = require('../lahan/model');
const myFunction = require('../function/function');
const { populate } = require('../lahan/model');

const statusEnum = Object.freeze({
  diajukan: '0',
  ditolak: '1',
  diterima: '2',
});

module.exports = {
  createTransaksi: async (req, res) => {
    try {
      console.log(req.userData.id);
      const {
        lahan,
        tipeCabai,
        tanggalPencatatan,
        jumlahDijual,
        hargaJual,
        grade,
        pembeli,
        namaPedagang,
        tipePedagang,
      } = req.body;

      const penjual = req.userData.id;
      const role = req.userData.role;

      let transaksi2 = async () => {
        if (penjual == pembeli) {
          res.status(400).json({
            message: 'Tidak dapat melakukan penjualan terhadap diri sendiri',
          });
        } // UNTUK PEDAGANG
        else if (role !== 'petani') {
          let newTransaksi = new Transaksi2({
            tanggalPencatatan,
            tipeCabai,
            penjual,
            jumlahDijual,
            hargaJual,
            pembeli,
          });
          await newTransaksi.save();

          res.status(201).json({
            message: 'Berhasil membuat Transaksi',
            data: newTransaksi,
          });
        } // UNTUK PETANI
        else {
          const cekLahan = await Lahan.findOne({
            _id: lahan,
            user: penjual,
          });
          if (!cekLahan) {
            res.status(400).json({
              message: 'Bukan lahan milikmu',
            });
          }

          let convjumlahDijual = jumlahDijual / 100;
          const totalProduksi = jumlahDijual * hargaJual;

          if (!pembeli) {
            let newTransaksi = new Transaksi2({
              lahan,
              tanggalPencatatan,
              penjual,
              jumlahDijual: convjumlahDijual,
              hargaJual,
              grade,
              totalProduksi,
              statusTransaksi: 2,
              namaPedagang,
              tipePedagang,
            });
            await newTransaksi.save();

            const addtoLahan = await Lahan.findOneAndUpdate(
              { _id: lahan, user: penjual },
              { $addToSet: { transaksi: newTransaksi._id } }
            );
            return newTransaksi.populate([
              { path: 'lahan', select: '_id tipeCabai namaLahan tanggalTanam' },
              { path: 'penjual', select: 'id name role' },
            ]);
          } else {
            let newTransaksi = new Transaksi2({
              lahan,
              tanggalPencatatan,
              penjual,
              jumlahDijual: convjumlahDijual,
              hargaJual,
              grade,
              totalProduksi,
              pembeli,
            });
            await newTransaksi.save();
            const addtoLahan = await Lahan.findOneAndUpdate(
              { _id: lahan, user: penjual },
              { $addToSet: { transaksi: newTransaksi._id } }
            );
            return newTransaksi.populate([
              { path: 'lahan', select: '_id tipeCabai namaLahan tanggalTanam' },
              { path: 'penjual', select: 'id name role' },
              { path: 'pembeli', select: 'id name role' },
            ]);
          }
        }
      };

      const dataTransaksi = await transaksi2();
      console.log(dataTransaksi);

      // UPDATE KE LAHAN
      const jumlahPanen = await myFunction.updateJumlahPanen(lahan, penjual);
      const jumlahPenjualan = await myFunction.updateJumlahPenjualan(
        lahan,
        penjual
      );
      const rjumlahPanen = await myFunction.updateRJumlahPanen(lahan, penjual);
      const rjumlahPenjualan = await myFunction.updateRJumlahPenjualan(
        lahan,
        penjual
      );
      const checkMulaiPanen = await myFunction.checkMulaiPanen(lahan, penjual);
      const updateKeuntungan = await myFunction.updateKeuntungan(
        lahan,
        penjual
      );

      res.status(201).json({
        message: 'Berhasil membuat Transaksi',
        data: dataTransaksi,
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

  seeMyTransaksi: async (req, res) => {
    try {
      const user = req.userData.id;
      const role = req.userData.role;

      if (role !== 'petani') {
        const myTransaksi = await Transaksi2.find({ penjual: user })
          .sort({
            tanggalPencatatan: 'descending',
            createdAt: 'descending',
          })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role');

        const countAllTransaksi = await Transaksi2.find({
          penjual: user,
        }).countDocuments();

        const myBeliTransaksi = await Transaksi2.find({ pembeli: user })
          .sort({
            tanggalPencatatan: 'descending',
            createdAt: 'descending',
          })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role');

        const countAllBeliTransaksi = await Transaksi2.find({
          pembeli: user,
        }).countDocuments();

        const userData = await User.findById(user).select('_id name');

        if (myTransaksi[0] == undefined && myBeliTransaksi[0] == undefined) {
          res.status(404).json({
            message: 'Belum ada Transaksi yang diisi',
          });
        } else {
          res.status(200).json({
            message: 'Berhasil melihat Transaksi Saya',
            user: userData,
            dijual: myTransaksi,
            countAllJualTransaksi: countAllTransaksi,
            dibeli: myBeliTransaksi,
            countAllBeliTransaksi: countAllBeliTransaksi,
          });
        }
      } else {
        const myTransaksi = await Transaksi2.find({ penjual: user })
          .sort({
            tanggalPencatatan: 'descending',
            createdAt: 'descending',
          })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role')
          .populate('lahan', '_id namaLahan tipeCabai tanggalTanam');
        console.log(myTransaksi[0]);

        const countAllTransaksi = await Transaksi2.find({
          penjual: user,
        }).countDocuments();

        const myBeliTransaksi = await Transaksi2.find({ pembeli: user })
          .sort({
            tanggalPencatatan: 'descending',
            createdAt: 'descending',
          })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role')
          .populate('lahan', '_id namaLahan tipeCabai tanggalTanam');

        const countAllBeliTransaksi = await Transaksi2.find({
          pembeli: user,
        }).countDocuments();

        const userData = await User.findById(user).select('_id name');

        if (myTransaksi[0] == undefined && myBeliTransaksi[0] == undefined) {
          res.status(404).json({
            message: 'Belum ada Transaksi yang diisi',
          });
        } else {
          res.status(200).json({
            message: 'Berhasil melihat Transaksi Saya',
            user: userData,
            dijual: myTransaksi,
            countAllJualTransaksi: countAllTransaksi,
            dibeli: myBeliTransaksi,
            countAllBeliTransaksi: countAllBeliTransaksi,
          });
        }
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

      const role = req.userData.role;

      if (role !== 'petani') {
        const aTransaksi = await Transaksi2.findOne({
          _id: id,
        })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role');

        const userData = await User.findById(user).select('_id name');

        if (!aTransaksi) {
          res.status(404).json({
            message: 'Transaksi tidak ditemukan',
          });
        } else {
          res.status(200).json({
            message: `Berhasil melihat Transaksi dengan id ${aTransaksi._id} `,
            user: userData,
            data: aTransaksi,
          });
        }
      } else {
        const aTransaksi = await Transaksi2.findOne({
          penjual: user,
          _id: id,
        })
          .populate('pembeli', '_id name role')
          .populate('penjual', '_id name role')
          .populate('lahan', '_id namaLahan tipeCabai tanggalTanam');

        const userData = await User.findById(user).select('_id name');

        if (!aTransaksi) {
          res.status(404).json({
            message: 'Transaksi tidak ditemukan',
          });
        } else {
          res.status(200).json({
            message: `Berhasil melihat Transaksi dengan id ${aTransaksi._id} `,
            user: userData,
            data: aTransaksi,
          });
        }
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

      const role = req.userData.role;

      const findTransaksi = await Transaksi2.findOne({ _id: id });

      if (role !== 'petani') {
        if (findTransaksi && user) {
          const transaksi = await Transaksi2.findOneAndRemove({
            _id: id,
            penjual: user,
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
      } else {
        if (findTransaksi && user) {
          const transaksi = await Transaksi2.findOneAndRemove({
            _id: id,
            penjual: user,
          })
            .populate('pembeli', '_id name role')
            .populate('penjual', '_id name role')
            .populate('lahan', '_id namaLahan tipeCabai tanggalTanam');
          console.log(transaksi.lahan);

          await Lahan.findOneAndUpdate(
            { _id: transaksi.lahan },
            { $pull: { transaksi: id } }
          );

          // UPDATE KE LAHAN

          const jumlahPanen = await myFunction.updateJumlahPanen(
            transaksi.lahan,
            user
          );
          const jumlahPenjualan = await myFunction.updateJumlahPenjualan(
            transaksi.lahan,
            user
          );
          const rjumlahPanen = await myFunction.updateRJumlahPanen(
            transaksi.lahan,
            user
          );
          const rjumlahPenjualan = await myFunction.updateRJumlahPenjualan(
            transaksi.lahan,
            user
          );
          const checkMulaiPanen = await myFunction.checkMulaiPanen(
            transaksi.lahan,
            user
          );
          const updateKeuntungan = await myFunction.updateKeuntungan(
            transaksi.lahan,
            user
          );

          res.status(201).json({
            message: 'Berhasil menghapus Transaksi',
            data: transaksi,
          });
        } else {
          res.status(404).json({
            message: 'Transaksi tidak ditemukan',
          });
        }
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

      const checkStatus = await Transaksi2.findById(id);
      console.log(checkStatus.statusTransaksi);

      if (checkStatus.statusTransaksi == statusEnum.diajukan) {
        await Transaksi2.findOneAndUpdate(
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

      const checkStatus = await Transaksi2.findById(id);
      if (checkStatus.statusTransaksi == statusEnum.diterima) {
        res.status(400).json({
          message: 'Transaksi sudah diterima pembeli',
        });
      }
      if (checkStatus.statusTransaksi !== statusEnum.diterima) {
        await Transaksi2.findOneAndUpdate(
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

      let convjumlahDijual = jumlahDijual / 100;

      const checkStatus = await Transaksi2.findById(id);
      console.log(checkStatus.statusTransaksi);

      if (checkStatus.statusTransaksi !== statusEnum.diterima) {
        const transaksi = await Transaksi2.findOneAndUpdate(
          { _id: id },
          {
            tipeCabai,
            jumlahDijual: convjumlahDijual,
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
};
