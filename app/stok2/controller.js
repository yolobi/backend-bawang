const Stok = require('./model');
const User = require('../users/model');
const Transaksi = require('../transaksi2/model');

module.exports = {
  sinkronStok: async (req, res) => {
    try {
      const lihatTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
      }).populate('lahan', '_id tipeCabai');

      if (lihatTransaksi[0] == undefined) {
        res.status(404).json({
          sucess: false,
          message:
            'Belum ada transaksi yang dilakukan atau belum ada transaksi yang disetujui',
        });
      } else {
        const stokCabai = (value) => {
          const sum = lihatTransaksi
            .filter((obj) => obj.tipeCabai == value && obj.statusTransaksi == 2)
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

        const penjualanCabai = (value) => {
          const sum = lihatTransaksi
            .filter(
              (obj) =>
                obj.tipeCabai == value &&
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

        const stokCMB = stokCabai('cabaiMerahBesar');
        const stokCMK = stokCabai('cabaiMerahKeriting');
        const stokCRM = stokCabai('cabaiRawitMerah');

        const pendapatanCMB = penjualanCabai('cabaiMerahBesar');
        const pendapatanCMK = penjualanCabai('cabaiMerahKeriting');
        const pendapatanCRM = penjualanCabai('cabaiRawitMerah');
        const totalPendapatan =
          Number(pendapatanCMB) + Number(pendapatanCMK) + Number(pendapatanCRM);

        const stok = await Stok.findOneAndUpdate(
          { user: req.userData.id },
          {
            stokCMB: stokCMB,
            stokCMK: stokCMK,
            stokCRM: stokCRM,
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
            totalTransaksi: lihatTransaksi.length,
            transaksiSukses: lihatTransaksi.filter(
              (obj) => obj.statusTransaksi == 2
            ).length,
            totalPengeluaran: Number(pembelianCabai.toFixed(3)),
            pendapatanCMB: pendapatanCMB,
            pendapatanCMK: pendapatanCMK,
            pendapatanCRM: pendapatanCRM,
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
      console.log(date);

      const start = `${date[0]}-${date[1]}-01`;
      const end = `${date[0]}-${date[1]}-31`;

      const lihatTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
        tanggalPencatatan: { $gte: start, $lte: end },
      }).populate('lahan', '_id tipeCabai');

      if (lihatTransaksi[0] == undefined) {
        res.status(404).json({
          sucess: false,
          message:
            'Belum ada transaksi yang dilakukan atau belum ada transaksi yang disetujui',
        });
      } else {
        const stokCabai = (value) => {
          const sum = lihatTransaksi
            .filter((obj) => obj.tipeCabai == value && obj.statusTransaksi == 2)
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

        const penjualanCabai = (value) => {
          const sum = lihatTransaksi
            .filter(
              (obj) =>
                obj.tipeCabai == value &&
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

        const stokCMB = stokCabai('cabaiMerahBesar');
        const stokCMK = stokCabai('cabaiMerahKeriting');
        const stokCRM = stokCabai('cabaiRawitMerah');

        const pendapatanCMB = penjualanCabai('cabaiMerahBesar');
        const pendapatanCMK = penjualanCabai('cabaiMerahKeriting');
        const pendapatanCRM = penjualanCabai('cabaiRawitMerah');
        const totalPendapatan =
          Number(pendapatanCMB) + Number(pendapatanCMK) + Number(pendapatanCRM);

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
            totalTransaksi: lihatTransaksi.length,
            transaksiSukses: lihatTransaksi.filter(
              (obj) => obj.statusTransaksi == 2
            ).length,
            totalPengeluaran: Number(pembelianCabai.toFixed(3)),
            pendapatanCMB: pendapatanCMB,
            pendapatanCMK: pendapatanCMK,
            pendapatanCRM: pendapatanCRM,
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
