const Stok = require('./model');
const User = require('../users/model');
const Transaksi = require('../transaksi2/model');

module.exports = {
  sinkronStok: async (req, res) => {
    try {
      const lihatTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
      }).populate('lahan', '_id komoditas');

      if (lihatTransaksi[0] == undefined) {
        res.status(404).json({
          sucess: false,
          message:
            'Belum ada transaksi yang dilakukan atau belum ada transaksi yang disetujui',
        });
      } else {
        const stokKomoditas = (value) => {
          const sum = lihatTransaksi
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
          const sum = lihatTransaksi
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
          return sum;
        };

        const pembelianCabai = lihatTransaksi
          .filter(
            (obj) =>
              obj.pembeli == req.userData.id &&
              obj.totalProduksi &&
              obj.statusTransaksi == 2
          )
          .reduce((accumulator, object) => {
            return accumulator + object.totalProduksi;
          }, 0);

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
        const totalPendapatan =
          Number(pendapatanCMB) +
          Number(pendapatanCMK) +
          Number(pendapatanCRM) +
          Number(pendapatanBM) +
          Number(pendapatanBP);

        const stok = await Stok.findOneAndUpdate(
          { user: req.userData.id },
          {
            stokCMB: stokCMB,
            stokCMK: stokCMK,
            stokCRM: stokCRM,
            stockBM: stokBM,
            stockBP: stokBP,
          },
          { new: true, upsert: true }
        ).populate('user', '_id name role');

        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Stok',
          data: {
            user: stok.user,
            stokCMB: stok.stokCMB,
            stokCMK: stok.stokCMK,
            stokCRM: stok.stokCRM,
            stokBM: stok.stockBM,
            stokBP: stok.stokBP,
            totalTransaksi: lihatTransaksi.length,
            transaksiSukses: lihatTransaksi.filter(
              (obj) => obj.statusTransaksi == 2
            ).length,
            totalPengeluaran: Number(pembelianCabai.toFixed(3)),
            pendapatanCMB: pendapatanCMB,
            pendapatanCMK: pendapatanCMK,
            pendapatanCRM: pendapatanCRM,
            pendapatanBM: pendapatanBM,
            pendapatanBP: pendapatanBP,
            totalPendapatan: totalPendapatan,
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  stokByBulan: async (req, res) => {
    try {
      const date = req.params.bulan.split('-');
      const start = `${date[0]}-${date[1]}-01`;
      const end = `${date[0]}-${date[1]}-31`;

      const lihatTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
        tanggalPencatatan: { $gte: start, $lte: end },
      }).populate('lahan', '_id komoditas');

      if (lihatTransaksi[0] == undefined) {
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
            stokCMB: 0,
            stokCMK: 0,
            stokCRM: 0,
            stokBM: 0,
            stokBP: 0,
            totalTransaksi: 0,
            transaksiSukses: 0,
            totalPengeluaran: 0,
            pendapatanCMB: 0,
            pendapatanCMK: 0,
            pendapatanCRM: 0,
            pendapatanBM: 0,
            pendapatanBP: 0,
            totalPendapatan: 0,
          },
        });
      } else {
        const stokKomoditas = (value) => {
          const sum = lihatTransaksi
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
          const sum = lihatTransaksi
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
          return sum;
        };

        const pembelianCabai = lihatTransaksi
          .filter(
            (obj) =>
              obj.pembeli == req.userData.id &&
              obj.totalProduksi &&
              obj.statusTransaksi == 2
          )
          .reduce((accumulator, object) => {
            return accumulator + object.totalProduksi;
          }, 0);

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
        const totalPendapatan =
          Number(pendapatanCMB) +
          Number(pendapatanCMK) +
          Number(pendapatanCRM) +
          Number(pendapatanBM) +
          Number(pendapatanBP);

        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Stok',
          data: {
            user: {
              _id: req.userData.id,
              name: req.userData.name,
              role: req.userData.role,
            },
            stokCMB: stokCMB,
            stokCMK: stokCMK,
            stokCRM: stokCRM,
            stockBM: stokBM,
            stokBP: stokBP,
            totalTransaksi: lihatTransaksi.length,
            transaksiSukses: lihatTransaksi.filter(
              (obj) => obj.statusTransaksi == 2
            ).length,
            totalPengeluaran: Number(pembelianCabai.toFixed(3)),
            pendapatanCMB: pendapatanCMB,
            pendapatanCMK: pendapatanCMK,
            pendapatanCRM: pendapatanCRM,
            pendapatanBM: pendapatanBM,
            pendapatanBP: pendapatanBP,
            totalPendapatan: totalPendapatan,
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
