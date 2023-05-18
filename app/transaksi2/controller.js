const Transaksi = require('./model');
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
  addTransaksi: async (req, res) => {
    try {
      const {
        lahan,
        komoditas,
        tanggalPencatatan,
        jumlahDijual,
        hargaJual,
        grade,
        pembeli,
        namaPembeli,
        tipePembeli,
      } = req.body;

      const penjual = req.userData.id;
      const role = req.userData.role;

      const convjumlahDijual = jumlahDijual / 100;
      const totalProduksi = jumlahDijual * hargaJual;

      let transaksiCond = async () => {
        if (penjual == pembeli) {
          res.status(400).json({
            success: false,
            message: 'Tidak dapat melakukan penjualan terhadap diri sendiri',
          });
        } // UNTUK PEDAGANG
        else if (role !== 'petani') {
          // TIDAK PUNYA AKUN
          if (!pembeli) {
            let newTransaksi = new Transaksi({
              tanggalPencatatan,
              komoditas,
              penjual,
              jumlahDijual: convjumlahDijual,
              hargaJual,
              totalProduksi,
              grade,
              statusTransaksi: 2,
              namaPembeli,
              tipePembeli,
            });
            await newTransaksi.save();
            return newTransaksi;
          } else {
            let newTransaksi = new Transaksi({
              tanggalPencatatan,
              komoditas,
              penjual,
              jumlahDijual: convjumlahDijual,
              hargaJual,
              totalProduksi,
              grade,
              pembeli,
            });
            await newTransaksi.save();

            return newTransaksi;
          }
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

          // Apabila pembeli tidak memiliki akun
          if (!pembeli) {
            let newTransaksi = new Transaksi({
              lahan,
              komoditas: cekLahan.komoditas,
              tanggalPencatatan,
              penjual,
              jumlahDijual: convjumlahDijual,
              hargaJual,
              grade,
              totalProduksi,
              statusTransaksi: 2,
              namaPembeli,
              tipePembeli,
            });
            await newTransaksi.save();

            const addtoLahan = await Lahan.findOneAndUpdate(
              { _id: lahan, user: penjual },
              { $addToSet: { transaksi: newTransaksi._id } }
            );

            await myFunction.updateDataLahan(lahan, penjual);

            return newTransaksi.populate([
              { path: 'lahan', select: '_id komoditas namaLahan tanggalTanam' },
              { path: 'penjual', select: 'id name role' },
            ]);
          }
          // Apabila pembeli memiliki akun
          else {
            let newTransaksi = new Transaksi({
              lahan,
              komoditas: cekLahan.komoditas,
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

            await myFunction.updateDataLahan(lahan, penjual);

            return newTransaksi.populate([
              { path: 'lahan', select: '_id komoditas namaLahan tanggalTanam' },
              { path: 'penjual', select: 'id name role' },
              { path: 'pembeli', select: 'id name role' },
            ]);
          }
        }
      };

      const dataTransaksi = await transaksiCond();
      console.log(dataTransaksi);

      res.status(201).json({
        success: true,
        message: 'Berhasil membuat Transaksi',
        data: dataTransaksi,
      });
    } catch (error) {
      res.status(500).json({
        success: true,
        message: error.message || `Internal server error`,
      });
    }
  },

  addTransaksiforPetani: async (req, res) => {
    try {
      const {
        lahan,
        tanggalPencatatan,
        jumlahDijual,
        hargaJual,
        grade,
        pembeli,
        namaPembeli,
        tipePembeli,
      } = req.body;

      let penjual = req.userData.id;

      let jumlahDijualtoKg = jumlahDijual / 100;
      let totalProduksi = jumlahDijual * hargaJual;

      const validateTransaksiOnSelf = async () => {
        if (penjual == pembeli) {
          res.status(400).json({
            success: false,
            message: 'Tidak dapat melakukan penjualan terhadap diri sendiri',
          });
        }
      };

      const validateLahan = async () => {
        const findLahan = await Lahan.findOne({
          _id: lahan,
          user: penjual,
        });
        if (!findLahan) {
          res.status(400).json({
            success: false,
            message: 'Bukan lahan milikmu',
          });
        } else {
          return findLahan;
        }
      };

      const addTransaksitoLahan = async (idTransaksi) => {
        await Lahan.findOneAndUpdate(
          { _id: lahan, user: penjual },
          { $addToSet: { transaksi: idTransaksi } }
        );
      };

      const transaksiWithoutAkun = async () => {
        let lahanDetail = await validateLahan();

        let newTransaksi = new Transaksi({
          lahan,
          komoditas: lahanDetail.komoditas,
          tanggalPencatatan,
          penjual,
          jumlahDijual: jumlahDijualtoKg.toFixed(3),
          hargaJual,
          grade,
          totalProduksi,
          statusTransaksi: 2,
          namaPembeli,
          tipePembeli,
        });
        await newTransaksi.save();

        await addTransaksitoLahan(newTransaksi._id);

        return newTransaksi.populate([
          { path: 'lahan', select: '_id komoditas namaLahan tanggalTanam' },
          { path: 'penjual', select: 'id name role' },
        ]);
      };

      const transaksiWithAkun = async () => {
        console.log('masuk with acun');
        let lahanDetail = await validateLahan();

        let newTransaksi = new Transaksi({
          lahan,
          komoditas: lahanDetail.komoditas,
          tanggalPencatatan,
          penjual,
          jumlahDijual: jumlahDijualtoKg.toFixed(3),
          hargaJual,
          grade,
          totalProduksi,
          pembeli,
        });
        await newTransaksi.save();

        await addTransaksitoLahan(newTransaksi._id);

        return newTransaksi.populate([
          { path: 'lahan', select: '_id komoditas namaLahan tanggalTanam' },
          { path: 'penjual', select: 'id name role' },
          { path: 'pembeli', select: 'id name role' },
        ]);
      };

      // START POINT
      await validateTransaksiOnSelf();
      if (!pembeli) {
        let detailTransaksi = await transaksiWithoutAkun();
        await myFunction.updateDataLahan(lahan, penjual);
        res.status(201).json({
          success: true,
          message: 'Berhasil membuat Transaksi',
          data: detailTransaksi,
        });
      } else {
        let detailTransaksi = await transaksiWithAkun();
        await myFunction.updateDataLahan(lahan, penjual);
        res.status(201).json({
          success: true,
          message: 'Berhasil membuat Transaksi',
          data: detailTransaksi,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  addTransaksiforPedagang: async (req, res) => {
    try {
      const {
        tanggalPencatatan,
        komoditas,
        jumlahDijual,
        hargaJual,
        grade,
        pembeli,
        namaPembeli,
        tipePembeli,
      } = req.body;

      let penjual = req.userData.id;

      let jumlahDijualtoKg = jumlahDijual / 100;
      let totalProduksi = jumlahDijual * hargaJual;

      const validateTransaksiOnSelf = async () => {
        if (penjual == pembeli) {
          res.status(400).json({
            success: false,
            message: 'Tidak dapat melakukan penjualan terhadap diri sendiri',
          });
        }
      };

      const transaksiWithoutAkun = async () => {
        let newTransaksi = new Transaksi({
          tanggalPencatatan,
          komoditas,
          penjual,
          jumlahDijual: jumlahDijualtoKg.toFixed(3),
          hargaJual,
          totalProduksi,
          grade,
          statusTransaksi: 2,
          namaPembeli,
          tipePembeli,
        });
        await newTransaksi.save();

        return newTransaksi.populate('penjual', 'id name role');
      };

      const transaksiWithAkun = async () => {
        let newTransaksi = new Transaksi({
          tanggalPencatatan,
          komoditas,
          penjual,
          jumlahDijual: jumlahDijualtoKg.toFixed(3),
          hargaJual,
          totalProduksi,
          grade,
          pembeli,
        });
        await newTransaksi.save();

        return newTransaksi.populate([
          { path: 'penjual', select: 'id name role' },
          { path: 'pembeli', select: 'id name role' },
        ]);
      };

      // START POINT
      await validateTransaksiOnSelf();
      if (!pembeli) {
        let detailTransaksi = await transaksiWithoutAkun();
        res.status(201).json({
          success: true,
          message: 'Berhasil membuat Transaksi',
          data: detailTransaksi,
        });
      } else {
        let detailTransaksi = await transaksiWithAkun();
        res.status(201).json({
          success: true,
          message: 'Berhasil membuat Transaksi',
          data: detailTransaksi,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getTransaksiAll: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findTransaksi = await Transaksi.find({
        $or: [{ pembeli: idUser }, { penjual: idUser }],
      })
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role')
        .populate('lahan', '_id namaLahan komoditas tanggalTanam');

      if (findTransaksi.length == 0 || !findTransaksi) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Transaksi yang diisi',
        });
      } else {
        let transaksiBeli = findTransaksi.filter(
          (obj) => Boolean(obj.pembeli) && obj.pembeli._id == idUser
        );

        let transaksiJual = findTransaksi.filter(
          (obj) => obj.penjual._id == idUser
        );

        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Transaksi yang telah dibuat user',
          data: {
            user: {
              _id: idUser,
              name: req.userData.name,
              role: req.userData.role,
            },
            countAllTransaksi: findTransaksi.length,
            countTransaksiJual: transaksiJual.length,
            countTransaksiBeli: transaksiBeli.length,
            transaksiJual: transaksiJual,
            transaksiBeli: transaksiBeli,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getTransaksibyID: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idTransaksi = req.params.idTransaksi;

      const findTransaksi = await Transaksi.findOne({
        user: idUser,
        _id: idTransaksi,
      })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role')
        .populate('lahan', '_id namaLahan komoditas tanggalTanam');

      if (!findTransaksi) {
        res.status(404).json({
          success: false,
          message: 'Transaksi tidak ditemukan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Berhasil melihat Transaksi dengan id ${findTransaksi._id}`,
          data: findTransaksi,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  deleteTransaksi: async (req, res) => {
    try {
      const idTransaksi = req.params.idTransaksi;
      const idUser = req.userData.id;

      const findTransaksi = await Transaksi.findOneAndRemove({
        _id: idTransaksi,
        penjual: idUser,
      })
        .populate('pembeli', '_id name role')
        .populate('penjual', '_id name role')
        .populate('lahan', '_id namaLahan komoditas tanggalTanam');

      if (!findTransaksi) {
        res.status(404).json({
          success: false,
          message: 'Transaksi tidak ditemukan',
        });
      } else {
        const isLahan = Boolean(findTransaksi.lahan);
        if (isLahan) {
          await Lahan.findOneAndUpdate(
            { _id: findTransaksi.lahan },
            { $pull: { transaksi: idTransaksi } }
          );
          await myFunction.updateDataLahan(findTransaksi.lahan, idUser);
        }
        res.status(200).json({
          success: true,
          message: 'Berhasil menghapus Transaksi',
          data: findTransaksi,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  changeStatusTerima: async (req, res) => {
    try {
      const idTransaksi = req.params.idTransaksi;

      const findTransaksi = await Transaksi.findOneAndUpdate(
        { _id: idTransaksi, statusTransaksi: statusEnum.diajukan },
        { statusTransaksi: statusEnum.diterima, $unset: { alasanDitolak: 1 } },
        { new: true }
      );

      if (!findTransaksi) {
        res.status(404).json({
          success: false,
          message:
            'Transaksi tidak ditemukan atau Harus mengajukan kembali Transaksi terlebih dahulu',
        });
      } else {
        const isLahan = Boolean(findTransaksi.lahan);
        const idPemilikLahan = findTransaksi.penjual;

        if (isLahan) {
          await myFunction.updateDataLahan(findTransaksi.lahan, idPemilikLahan);
        }
        res.status(200).json({
          success: true,
          message: 'Status Transaksi berhasil diubah menjadi Diterima',
          data: { statusTransaksi: statusEnum.diterima },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
      console.log(error);
    }
  },

  changeStatusTolak: async (req, res) => {
    try {
      const idTransaksi = req.params.idTransaksi;
      const { alasanDitolak } = req.body;

      const findTransaksi = await Transaksi.findOneAndUpdate(
        {
          _id: idTransaksi,
          $or: [
            { statusTransaksi: statusEnum.diajukan },
            { statusTransaksi: statusEnum.ditolak },
          ],
        },
        { statusTransaksi: statusEnum.ditolak, alasanDitolak: alasanDitolak }
      );

      if (!findTransaksi) {
        res.status(404).json({
          success: false,
          message:
            'Transaksi sudah diterima pembeli atau statusTransaksi tidak valid',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Status Transaksi berhasil diubah menjadi Ditolak',
          data: {
            statusTransaksi: statusEnum.ditolak,
            alasanDitolak: alasanDitolak,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
      console.log(error);
    }
  },

  changeStatusAjukan: async (req, res) => {
    try {
      const idTransaksi = req.params.idTransaksi;
      const { komoditas, jumlahDijual, hargaJual } = req.body;

      let jumlahDijualtoKg = jumlahDijual / 100;

      const findTransaksi = await Transaksi.findOneAndUpdate(
        {
          _id: idTransaksi,
          $or: [
            { statusTransaksi: statusEnum.diajukan },
            { statusTransaksi: statusEnum.ditolak },
          ],
        },
        {
          komoditas,
          jumlahDijual: jumlahDijualtoKg.toFixed(3),
          hargaJual,
          statusTransaksi: statusEnum.diajukan,
        },
        { new: true }
      );

      if (!findTransaksi) {
        res.status(404).json({
          success: false,
          message:
            'Transaksi sudah diterima pembeli atau statusTransaksi tidak valid',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Status Transaksi berhasil diubah menjadi Diajukan',
          data: findTransaksi,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
      console.log(error);
    }
  },

  summaryTransaksiAll: async (req, res) => {
    try {
      const findTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
      }).populate('lahan', '_id komoditas');

      if (findTransaksi[0] == undefined) {
        res.status(200).json({
          success: true,
          message:
            'Belum ada transaksi yang dilakukan atau belum ada transaksi yang disetujui',
          data: {
            user: {
              _id: req.userData.id,
              name: req.userData.name,
              role: req.userData.role,
            },
            countTransaksiAll: 0,
            countTransaksiSuksesAll: 0,
            countTransaksiSuksesBeli: 0,
            countTransaksiSuksesJual: 0,
            stokCMB: 0,
            stokCMK: 0,
            stokCRM: 0,
            stokBM: 0,
            stokBP: 0,
            pendapatanCMB: 0,
            pendapatanCMK: 0,
            pendapatanCRM: 0,
            pendapatanBM: 0,
            pendapatanBP: 0,
            totalPembelian: 0,
            totalPenjualan: 0,
            totalPendapatan: 0,
          },
        });
      } else {
        const stokKomoditas = (value) => {
          const sum = findTransaksi
            .filter((obj) => obj.komoditas == value && obj.statusTransaksi == 2)
            .reduce((accumulator, object) => {
              if (object.pembeli == req.userData.id) {
                accumulator += object.jumlahDijual;
              } else {
                accumulator -= object.jumlahDijual;
              }
              return accumulator < 0 ? 0 : accumulator;
            }, 0);
          return sum ? sum.toFixed(3) : 0;
        };

        const penjualanKomoditas = (value) => {
          const sum = findTransaksi
            .filter(
              (obj) =>
                obj.komoditas == value &&
                obj.penjual == req.userData.id &&
                obj.totalProduksi &&
                obj.statusTransaksi == 2
            )
            .reduce((accumulator, object) => {
              return accumulator + object.totalProduksi;
            }, 0);
          return sum ? sum.toFixed(3) : 0;
        };

        const pembelianCabai = findTransaksi
          .filter(
            (obj) =>
              obj.pembeli == req.userData.id &&
              obj.totalProduksi &&
              obj.statusTransaksi == 2
          )
          .reduce((accumulator, object) => {
            return accumulator + object.totalProduksi;
          }, 0);

        const countTransaksiSuksesBeli = findTransaksi.filter(
          (obj) => obj.statusTransaksi == 2 && obj.pembeli == req.userData.id
        ).length;
        const countTransaksiSuksesJual = findTransaksi.filter(
          (obj) => obj.statusTransaksi == 2 && obj.penjual == req.userData.id
        ).length;

        const stokCMB = stokKomoditas('cabaiMerahBesar');
        const stokCMK = stokKomoditas('cabaiMerahKeriting');
        const stokCRM = stokKomoditas('cabaiRawitMerah');
        const stokBM = stokKomoditas('bawangMerah');
        const stokBP = stokKomoditas('bawangPutih');

        const pendapatanCMB = penjualanKomoditas('cabaiMerahBesar');
        const pendapatanCMK = penjualanKomoditas('cabaiMerahKeriting');
        const pendapatanCRM = penjualanKomoditas('cabaiRawitMerah');
        const pendapatanBM = penjualanKomoditas('bawangMerah');
        const pendapatanBP = penjualanKomoditas('bawangPutih');
        const totalPenjualan =
          Number(pendapatanCMB) + Number(pendapatanCMK) + Number(pendapatanCRM + Number(pendapatanBM) + Number(pendapatanBP);

        const totalPendapatan =
          totalPenjualan - pembelianCabai < 0
            ? 0
            : (totalPenjualan - pembelianCabai).toFixed(3);

        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Summary',
          data: {
            user: {
              _id: req.userData.id,
              name: req.userData.name,
              role: req.userData.role,
            },
            countTransaksiAll: findTransaksi.length,
            countTransaksiSuksesAll:
              countTransaksiSuksesBeli + countTransaksiSuksesJual,
            countTransaksiSuksesBeli: countTransaksiSuksesBeli,
            countTransaksiSuksesJual: countTransaksiSuksesJual,
            stokCMB: Number(stokCMB),
            stokCMK: Number(stokCMK),
            stokCRM: Number(stokCRM),
            stokBM: Number(stokBM),
            stokBP: Number(stokBP),
            pendapatanCMB: Number(pendapatanCMB),
            pendapatanCMK: Number(pendapatanCMK),
            pendapatanCRM: Number(pendapatanCRM),
            pendapatanBM: Number(pendapatanBM),
            pendapatanBP: Number(pendapatanBP),
            totalPembelian: Number(pembelianCabai.toFixed(3)),
            totalPenjualan: totalPenjualan,
            totalPendapatan: Number(totalPendapatan),
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  summaryTransaksibyBulan: async (req, res) => {
    try {
      const date = req.params.bulan.split('-');
      const start = `${date[0]}-${date[1]}-01`;
      const end = `${date[0]}-${date[1]}-31`;

      const findTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
        tanggalPencatatan: { $gte: start, $lte: end },
      }).populate('lahan', '_id komoditas');

      if (findTransaksi[0] == undefined) {
        res.status(200).json({
          success: true,
          message:
            'Belum ada transaksi yang dilakukan atau belum ada transaksi yang disetujui',
          data: {
            user: {
              _id: req.userData.id,
              name: req.userData.name,
              role: req.userData.role,
            },
            countTransaksiAll: 0,
            countTransaksiSuksesAll: 0,
            countTransaksiSuksesBeli: 0,
            countTransaksiSuksesJual: 0,
            stokCMB: 0,
            stokCMK: 0,
            stokCRM: 0,
            stokBM: 0,
            stokBP: 0,
            pendapatanCMB: 0,
            pendapatanCMK: 0,
            pendapatanCRM: 0,
            pendapatanBM: 0,
            pendapatanBP: 0,
            totalPembelian: 0,
            totalPenjualan: 0,
            totalPendapatan: 0,
          },
        });
      } else {
        const stokKomoditas = (value) => {
          const sum = findTransaksi
            .filter((obj) => obj.komoditas == value && obj.statusTransaksi == 2)
            .reduce((accumulator, object) => {
              if (object.pembeli == req.userData.id) {
                accumulator += object.jumlahDijual;
              } else {
                accumulator -= object.jumlahDijual;
              }
              return accumulator < 0 ? 0 : accumulator;
            }, 0);
          return sum ? sum.toFixed(3) : 0;
        };

        const penjualanKomoditas = (value) => {
          const sum = findTransaksi
            .filter(
              (obj) =>
                obj.komoditas == value &&
                obj.penjual == req.userData.id &&
                obj.totalProduksi &&
                obj.statusTransaksi == 2
            )
            .reduce((accumulator, object) => {
              return accumulator + object.totalProduksi;
            }, 0);
          return sum ? sum.toFixed(3) : 0;
        };

        const pembelianCabai = findTransaksi
          .filter(
            (obj) =>
              obj.pembeli == req.userData.id &&
              obj.totalProduksi &&
              obj.statusTransaksi == 2
          )
          .reduce((accumulator, object) => {
            return accumulator + object.totalProduksi;
          }, 0);

        const countTransaksiSuksesBeli = findTransaksi.filter(
          (obj) => obj.statusTransaksi == 2 && obj.pembeli == req.userData.id
        ).length;
        const countTransaksiSuksesJual = findTransaksi.filter(
          (obj) => obj.statusTransaksi == 2 && obj.penjual == req.userData.id
        ).length;

        const stokCMB = stokKomoditas('cabaiMerahBesar');
        const stokCMK = stokKomoditas('cabaiMerahKeriting');
        const stokCRM = stokKomoditas('cabaiRawitMerah');
        const stokBM = stokKomoditas('bawangMerah');
        const stokBP = stokKomoditas('bawangPutih');

        const pendapatanCMB = penjualanKomoditas('cabaiMerahBesar');
        const pendapatanCMK = penjualanKomoditas('cabaiMerahKeriting');
        const pendapatanCRM = penjualanKomoditas('cabaiRawitMerah');
        const pendapatanBM = penjualanKomoditas('bawangMerah');
        const pendapatanBP = penjualanKomoditas('bawangPutih');
        const totalPenjualan =
          Number(pendapatanCMB) + Number(pendapatanCMK) + Number(pendapatanCRM) + Number(pendapatanBM) + Number(pendapatanBP);

        const totalPendapatan =
          totalPenjualan - pembelianCabai < 0
            ? 0
            : (totalPenjualan - pembelianCabai).toFixed(3);

        res.status(200).json({
          success: true,
          message: `Berhasil melihat Summary untuk ${req.params.bulan}`,
          data: {
            user: {
              _id: req.userData.id,
              name: req.userData.name,
              role: req.userData.role,
            },
            countTransaksiAll: findTransaksi.length,
            countTransaksiSuksesAll:
              countTransaksiSuksesBeli + countTransaksiSuksesJual,
            countTransaksiSuksesBeli: countTransaksiSuksesBeli,
            countTransaksiSuksesJual: countTransaksiSuksesJual,
            stokCMB: Number(stokCMB),
            stokCMK: Number(stokCMK),
            stokCRM: Number(stokCRM),
            stokBM: Number(stokBM),
            stokBP: Number(stokBP),
            pendapatanCMB: Number(pendapatanCMB),
            pendapatanCMK: Number(pendapatanCMK),
            pendapatanCRM: Number(pendapatanCRM),
            pendapatanBM: Number(pendapatanBM),
            pendapatanBP: Number(pendapatanBP),
            totalPembelian: Number(pembelianCabai.toFixed(3)),
            totalPenjualan: totalPenjualan,
            totalPendapatan: Number(totalPendapatan),
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
