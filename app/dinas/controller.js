const { totalBulanLahan } = require('../constants/lahans');
const Lahan = require('../lahan/model');
const Blanko = require('../blanko2/model');

module.exports = {
  index: async (req, res) => {
    try {
      const { jenisStatistik, provinsi, kabupaten, kecamatan } = req.query;

      const today = new Date();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const monthInt = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };

      const fiveMonthAgo = new Date();
      fiveMonthAgo.setMonth(fiveMonthAgo.getMonth() - (totalBulanLahan - 1));

      const startDate = new Date(
        `${fiveMonthAgo.getFullYear()}-${fiveMonthAgo
          .toISOString()
          .slice(5, 7)}-01`
      );
      const endDate = new Date(
        `${today.getFullYear()}-${today.toISOString().slice(5, 7)}-31`
      );

      const query = {
        $match: {
          tanggalPencatatan: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      };

      if (provinsi) {
        query['$match']['provinsi'] = Number(provinsi);
      }

      if (kabupaten) {
        query['$match']['kabupaten'] = Number(kabupaten);
      }

      if (kecamatan) {
        query['$match']['kecamatan'] = Number(kecamatan);
      }

      const komoditas = await Blanko.aggregate([
        query,
        {
          $group: {
            _id: {
              komoditas: '$komoditas',
              bulan: {
                $month: '$tanggalPencatatan',
              },
            },
            averageHargaJual: { $avg: '$rataHargaJual' },
            jumlahPanen: { $sum: '$prodPanenHabis' },
          },
        },
      ]);

      const uniqueKomoditas = [
        ...new Set(komoditas.map((k) => k._id.komoditas)),
      ];

      let percentage = {
        bawangMerah: 0,
        bawangPutih: 0,
        cabaiMerahBesar: 0,
        cabaiMerahKeriting: 0,
        cabaiRawitMerah: 0,
      };
      const response = {
        bawangMerah: [],
        bawangPutih: [],
        cabaiMerahBesar: [],
        cabaiMerahKeriting: [],
        cabaiRawitMerah: [],
      };
      for (let i = 0; i < komoditas.length; i++) {
        const kom = komoditas[i];

        let value = 0;
        if (jenisStatistik == 'produksi') {
          value = kom.jumlahPanen;
        } else {
          value = kom.averageHargaJual;
        }
        response[kom._id.komoditas].push([monthNames[kom._id.bulan], value]);
      }

      for (const key in response) {
        const value = response[key];
        response[key].sort((a, b) => monthInt[a[0]] - monthInt[b[0]]);
        const len = value.length;
        if (len > 1) {
          percentage[key] =
            ((value[len - 1][1] - value[len - 2][1]) / value[len - 2][1]) * 100;
        } else if (len > 0) {
          percentage[key] = 100;
        } else percentage[key] = 0;

        percentage[key] = percentage[key].toFixed(1);
      }

      return res.status(200).json({
        message: 'berhasil masuk sebagai Petugas Dinas, Selamat Datang!',
        data: {
          user: req.userData,
          komoditas: response,
          persentase: percentage,
        },
      });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },
};
