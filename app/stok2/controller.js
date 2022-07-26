const Stok = require('./model');
const User = require('../users/model');
const Transaksi = require('../transaksi2/model');

module.exports = {
  sinkronStok: async (req, res) => {
    try {
      const lihatTransaksi = await Transaksi.find({
        $or: [{ pembeli: req.userData.id }, { penjual: req.userData.id }],
        statusTransaksi: 2,
      }).populate('lahan', '_id tipeCabai');
      console.log(lihatTransaksi);

      if (lihatTransaksi[0] == undefined) {
        res.status(404).json({
          sucess: false,
          message:
            'Belum ada transaksi yang dilakukan atau belum ada transaksi yang disetujui',
        });
      } else {
        const stokCMB = lihatTransaksi
          .filter((obj) => obj.tipeCabai == 'cabaiMerahBesar')
          .reduce((accumulator, object) => {
            if (object.pembeli == req.userData.id) {
              accumulator += object.jumlahDijual;
            } else {
              accumulator -= object.jumlahDijual;
            }
            return accumulator < 0 ? 0 : accumulator;
          }, 0);

        const stokCMK = lihatTransaksi
          .filter((obj) => obj.tipeCabai == 'cabaiMerahKeriting')
          .reduce((accumulator, object) => {
            if (object.pembeli == req.userData.id) {
              accumulator += object.jumlahDijual;
            } else {
              accumulator -= object.jumlahDijual;
            }
            return accumulator < 0 ? 0 : accumulator;
          }, 0);

        const stokCRM = lihatTransaksi
          .filter((obj) => obj.tipeCabai == 'cabaiRawitMerah')
          .reduce((accumulator, object) => {
            if (object.pembeli == req.userData.id) {
              accumulator += object.jumlahDijual;
            } else {
              accumulator -= object.jumlahDijual;
            }
            return accumulator < 0 ? 0 : accumulator;
          }, 0);

        const stok = await Stok.findOneAndUpdate(
          { user: req.userData.id },
          {
            stokCMB: stokCMB.toFixed(3),
            stokCMK: stokCMK.toFixed(3),
            stokCRM: stokCRM.toFixed(3),
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
