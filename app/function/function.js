const indonesia = require('territory-indonesia');
const Transaksi2 = require('../transaksi2/model');
const User = require('../users/model');
const Lahan = require('../lahan/model');
const Blanko2 = require('../blanko2/model');

module.exports = {
  teritoryInfo: async (idProvinsi, idKabupaten, idKecamatan) => {
    let detailProvinsi =
      (await indonesia.getProvinceById(idProvinsi.toString())) ||
      'idProvinsi tidak valid';

    let detailKabupaten =
      (await indonesia.getRegencyById(idKabupaten.toString())) ||
      'idKabupaten tidak valid';

    let detailKecamatan =
      (await indonesia.getDistrictById(idKecamatan.toString())) ||
      'idKecamatan tidak valid';

    const removeLatLong = (detail) => {
      if (typeof detail === 'string') {
        return detail;
      } else {
        let { latitude, longitude, ...newDataDetail } = detail;
        return newDataDetail;
      }
    };

    return {
      detailProvinsi: removeLatLong(detailProvinsi),
      detailKabupaten: removeLatLong(detailKabupaten),
      detailKecamatan: removeLatLong(detailKecamatan),
    };
  },

  luasLahan: async (idLahan, idUser) => {
    const penjual = idUser;
    const lahan = idLahan;

    const findLahan = await Lahan.findOne({ _id: lahan, user: penjual }).select(
      '_id luasLahan'
    );

    return findLahan.luasLahan;
  },

  countTransaksi: async (idLahan, idUser) => {
    const findLahan = await Lahan.findOne({
      _id: idLahan,
      user: idUser,
    }).select('_id transaksi');

    const count = findLahan.transaksi.length;
    return count;
  },

  updateKeuntungan: async (idLahan, idUser) => {
    const findLahan = await Lahan.findOne({
      _id: idLahan,
      user: idUser,
    }).populate({
      path: 'transaksi',
      select:
        '_id jumlahDijual totalProduksi tanggalPencatatan statusTransaksi',
      match: { statusTransaksi: 2 },
    });

    let countTransaksi = findLahan.transaksi.length;

    if (countTransaksi == 0 || !countTransaksi) {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        {
          keuntungan: 0,
        }
      );
    } else {
      let jumlahPenjualan = findLahan.transaksi
        .map((item) => item.totalProduksi)
        .reduce((prev, next) => prev + next);

      let keuntungan = jumlahPenjualan - findLahan.totalModal;

      const hasilUpdate = await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        {
          keuntungan: keuntungan.toFixed(3),
        },
        { new: true }
      );
      return hasilUpdate;
    }
  },

  updateDataLahan: async (idLahan, idUser) => {
    let penjual = idUser;
    let lahan = idLahan;

    const findLahan = await Lahan.findOne({
      _id: lahan,
      user: penjual,
    }).populate({
      path: 'transaksi',
      select:
        '_id jumlahDijual totalProduksi tanggalPencatatan statusTransaksi',
      match: { statusTransaksi: 2 },
    });

    let countTransaksi = findLahan.transaksi.length;

    if (countTransaksi == 0 || !countTransaksi) {
      const hasilUpdate = await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        {
          jumlahPanen: 0,
          jumlahPenjualan: 0,
          rataanJumlahPanen: 0,
          rataanHargaJual: 0,
          tanggalMulaiPanen: null,
          keuntungan: 0,
        },
        { new: true }
      );
      return hasilUpdate;
    } else {
      let jumlahPanen = findLahan.transaksi
        .map((item) => item.jumlahDijual)
        .reduce((prev, next) => prev + next);

      let jumlahPenjualan = findLahan.transaksi
        .map((item) => item.totalProduksi)
        .reduce((prev, next) => prev + next);

      let rataanJumlahPanen = jumlahPanen / countTransaksi;

      let rataanHargaJual = jumlahPenjualan / (jumlahPanen * 100);

      let keuntungan =
        jumlahPenjualan - findLahan.totalModal < 0
          ? 0
          : jumlahPenjualan - findLahan.totalModal;

      let transaksiPertama = findLahan.transaksi[0].tanggalPencatatan;

      const hasilUpdate = await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        {
          jumlahPanen: jumlahPanen.toFixed(3),
          jumlahPenjualan: jumlahPenjualan.toFixed(3),
          rataanJumlahPanen: rataanJumlahPanen.toFixed(3),
          rataanHargaJual: rataanHargaJual.toFixed(3),
          tanggalMulaiPanen: transaksiPertama,
          keuntungan: keuntungan.toFixed(3),
        },
        { new: true }
      );
      return hasilUpdate;
    }
  },

  cekBlanko: async (idUser, tanggalPencatatan, komoditas, musimPanen) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findBlanko = await Blanko2.findOne({
      user: idUser,
      komoditas: komoditas,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (!findBlanko) {
      const teritory = await User.findById(idUser).select(
        '_id provinsi kabupaten kecamatan'
      );

      let blanko = new Blanko2({
        user: idUser,
        tanggalPencatatan,
        komoditas,
        provinsi: teritory.provinsi,
        kabupaten: teritory.kabupaten,
        kecamatan: teritory.kecamatan,
        musim: musimPanen,
      });
      await blanko.save();
      return blanko;
    } else {
      return findBlanko;
    }
  },

  updateKolom5: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalSelesai: { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalSelesai luasLahan komoditas');

    const sum = findLahan.reduce((accumulator, object) => {
      return accumulator + object.luasLahan;
    }, 0);

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        komoditas: komoditas,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      { luasPanenHabis: sum.toFixed(3) }
    );
  },

  updateKolom7: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalSelesai: null || { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalSelesai luasLahan luasRusak komoditas');

    const sum = findLahan.reduce((accumulator, object) => {
      return accumulator + object.luasRusak;
    }, 0);

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        komoditas: komoditas,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      { luasRusak: sum.toFixed(3) }
    );

    await Lahan.updateMany(
      {
        user: idUser,
        komoditas: komoditas,
        tanggalSelesai: null,
      },
      { luasRusak: 0, persenRusak: 0 }
    );
  },

  updateKolom8: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalTanam: { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalTanam luasLahan komoditas');

    const sum = findLahan.reduce((accumulator, object) => {
      return accumulator + object.luasLahan;
    }, 0);

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        komoditas: komoditas,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      { luasPenanamanBaru: sum.toFixed(3) }
    );
  },

  updateKolom10: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalSelesai: null,
    })
      .select('_id namaLahan tanggalTanam tanggalSelesai transaksi komoditas')
      .populate({
        path: 'transaksi',
        select: '_id jumlahDijual tanggalPencatatan',
        match: {
          tanggalPencatatan: { $gte: start, $lte: end },
          jumlahDijual: { $ne: null || undefined },
        },
      });

    if (findLahan.length !== 0) {
      const jumlahPanen = findLahan
        .map((item) =>
          item.transaksi.reduce((accumulator, object) => {
            return accumulator + object.jumlahDijual;
          }, 0)
        )
        .reduce((prev, next) => prev + next);

      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { prodPanenHabis: jumlahPanen.toFixed(3) }
      );
    }
  },

  updateKolom11: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalSelesai: { $gte: start, $lte: end },
    })
      .select('_id namaLahan tanggalTanam tanggalSelesai transaksi komoditas')
      .populate({
        path: 'transaksi',
        select: '_id jumlahDijual tanggalPencatatan',
        match: {
          tanggalPencatatan: { $gte: start, $lte: end },
          jumlahDijual: { $ne: null || undefined },
        },
      });

    if (findLahan.length !== 0) {
      const jumlahPanen = findLahan
        .map((item) =>
          item.transaksi.reduce((accumulator, object) => {
            return accumulator + object.jumlahDijual;
          }, 0)
        )
        .reduce((prev, next) => prev + next);

      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { prodBelumHabis: jumlahPanen.toFixed(3) }
      );
    }
  },

  updateKolom12: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
    })
      .select('_id namaLahan tanggalTanam tanggalSelesai transaksi komoditas')
      .populate({
        path: 'transaksi',
        select: '_id jumlahDijual tanggalPencatatan totalProduksi',
        match: {
          tanggalPencatatan: { $gte: start, $lte: end },
          jumlahDijual: { $ne: null || undefined },
        },
      });

    const jumlahPanen = findLahan
      .map((item) =>
        item.transaksi.reduce((accumulator, object) => {
          return accumulator + object.jumlahDijual;
        }, 0)
      )
      .reduce((prev, next) => prev + next);

    const totalProd = findLahan
      .map((item) =>
        item.transaksi.reduce((accumulator, object) => {
          return accumulator + object.totalProduksi;
        }, 0)
      )
      .reduce((prev, next) => prev + next);

    const sum = totalProd / (jumlahPanen * 100);

    if (sum > 0) {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { rataHargaJual: sum.toFixed(3) }
      );
    } else {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { rataHargaJual: 0 }
      );
    }
  },

  updateKolom4: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const prevstart =
      bulan === '01' ? `${tahun}-12-01` : `${tahun}-0${parseInt(bulan) - 1}-01`;
    const prevend =
      bulan === '01' ? `${tahun}-12-31` : `${tahun}-0${parseInt(bulan) - 1}-31`;

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const prevbulanBlanko = await Blanko2.findOne({
      user: idUser,
      komoditas: komoditas,
      tanggalPencatatan: { $gte: prevstart, $lte: prevend },
    });

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      komoditas: komoditas,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (prevbulanBlanko) {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasTanamanAkhirBulanLalu:
            prevbulanBlanko.luasTanamanAkhirBulanLaporan,
        }
      );
    } else {
      const findLahan = await Lahan.find({
        user: idUser,
        komoditas: komoditas,
        tanggalSelesai: null,
      }).select('_id namaLahan tanggalTanam luasLahan komoditas');

      const sum = findLahan.reduce((accumulator, object) => {
        return accumulator + object.luasLahan;
      }, 0);

      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasTanamanAkhirBulanLalu: sum,
        }
      );
    }
  },

  updateKolom9: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      komoditas: komoditas,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    let sum =
      bulanBlanko.luasTanamanAkhirBulanLalu -
      bulanBlanko.luasPanenHabis -
      bulanBlanko.luasRusak +
      bulanBlanko.luasPenanamanBaru;

    let realsum = sum < 0.001 ? 0 : sum;

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        komoditas: komoditas,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      {
        luasTanamanAkhirBulanLaporan: realsum.toFixed(3),
      }
    );
  },

  updateKolom5baru: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalSelesai: { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalTanam tanggalSelesai luasLahan komoditas');

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      komoditas: komoditas,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (findLahan.length !== 0) {
      const sum = bulanBlanko.luasTanamanAkhirBulanLalu - bulanBlanko.luasRusak;
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenHabis: sum.toFixed(3),
        }
      );
    } else {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenHabis: 0,
        }
      );
    }
  },

  updateKolom6: async (idUser, tanggalPencatatan, komoditas) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      komoditas: komoditas,
      tanggalSelesai: null,
    }).select('_id namaLahan tanggalTanam tanggalSelesai luasLahan komoditas');

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      komoditas: komoditas,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (findLahan.length !== 0) {
      const sum = bulanBlanko.luasTanamanAkhirBulanLalu - bulanBlanko.luasRusak;
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenBelumHabis: sum.toFixed(3),
        }
      );
    } else {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenBelumHabis: 0,
        }
      );
    }
  },
};
