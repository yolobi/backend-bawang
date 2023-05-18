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
      console.log('query', query);

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

      const response = {};
      for (let i = 0; i < komoditas.length; i++) {
        const kom = komoditas[i];
        console.log(monthNames[kom._id.bulan]);
        let value = 0;
        if (jenisStatistik == 'produksi') {
          value = kom.jumlahPanen;
        } else {
          value = kom.averageHargaJual;
        }
        response[kom._id.komoditas] = {
          [monthNames[kom._id.bulan]]: {
            data: value,
          },
        };
      }

      return res.status(200).json({
        message: 'berhasil masuk sebagai Petugas Dinas, Selamat Datang!',
        data: {
          user: req.userData,
          komoditas: response,
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
