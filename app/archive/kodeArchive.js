const indonesia = require('territory-indonesia');
const Transaksi2 = require('../transaksi2/model');
const User = require('../users/model');
const Lahan = require('../lahan/model');
const Blanko2 = require('../blanko2/model');

module.exports = {
  teritoryInfo: async (id) => {
    if (id.toString().length === 2) {
      let dataProvinsi = await indonesia.getProvinceById(id.toString());
      let { latitude, longitude, ...newdataProvinsi } = dataProvinsi;
      return newdataProvinsi;
    } else if (id.toString().length === 4) {
      let dataKabupaten = await indonesia.getRegencyById(id.toString());
      let { latitude, longitude, ...newdataKabupaten } = dataKabupaten;
      return newdataKabupaten;
    } else if (id.toString().length === 7) {
      let dataKecamatan = await indonesia.getDistrictById(id.toString());
      let { latitude, longitude, ...newdataKecamatan } = dataKecamatan;
      return newdataKecamatan;
    } else {
      return 'data tidak valid';
    }
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

  updateDataLahan: async (idLahan, idUser, next) => {
    let penjual = idUser;
    let lahan = idLahan;

    const findLahan = await Lahan.findOne({
      _id: lahan,
      user: penjual,
    }).populate(
      'transaksi',
      '_id jumlahDijual totalProduksi tanggalPencatatan'
    );

    let countTransaksi = findLahan.transaksi.length;
    let transaksiPertama = findLahan.transaksi[0].tanggalPencatatan;

    if (countTransaksi == 0 || undefined) {
      await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        {
          jumlahPanen: 0,
          jumlahPenjualan: 0,
          rataanJumlahPanen: 0,
          rataanHargaJual: 0,
          tanggalMulaiPanen: null,
          keuntungan: 0,
        }
      );
    } else {
      let jumlahPanen = findLahan.transaksi
        .map((item) => item.jumlahDijual)
        .reduce((prev, next) => prev + next);

      let jumlahPenjualan = findLahan.transaksi
        .map((item) => item.totalProduksi)
        .reduce((prev, next) => prev + next);

      let rataanJumlahPanen = jumlahPanen / countTransaksi;

      let rataanHargaJual = jumlahPenjualan / countTransaksi;

      let keuntungan = jumlahPenjualan - findLahan.totalModal;

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
      console.log(hasilUpdate);

      return hasilUpdate;
    }
  },

  updateJumlahPanen: async (idLahan, idUser) => {
    console.log('this is jumlah panen');
    const penjual = idUser;
    const lahan = idLahan;

    const findLahan = await Lahan.findOne({ _id: lahan, user: penjual })
      .select('_id transaksi')
      .populate('transaksi', '_id jumlahDijual');

    if (findLahan.transaksi[0] == undefined) {
      await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        { jumlahPanen: 0 }
      );
      return 0;
    } else {
      const jumlahPanen = findLahan.transaksi
        .map((item) => item.jumlahDijual)
        .reduce((prev, next) => prev + next);

      await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        { jumlahPanen: jumlahPanen }
      );

      return jumlahPanen;
    }
  },

  updateJumlahPenjualan: async (idLahan, idUser) => {
    console.log('this is jumlah penjualan');
    const penjual = idUser;
    const lahan = idLahan;

    const findLahan = await Lahan.findOne({ _id: lahan, user: penjual })
      .select('_id transaksi')
      .populate('transaksi', '_id totalProduksi');

    if (findLahan.transaksi[0] == undefined) {
      await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        { jumlahPenjualan: 0 }
      );
      return 0;
    } else {
      const jumlahPenjualan = findLahan.transaksi
        .map((item) => item.totalProduksi)
        .reduce((prev, next) => prev + next);

      await Lahan.findOneAndUpdate(
        { _id: lahan, user: penjual },
        { jumlahPenjualan: jumlahPenjualan }
      );

      return jumlahPenjualan;
    }
  },

  updateRJumlahPanen: async (idLahan, idUser) => {
    console.log('this is rata jumlah panen');
    const findLahan = await Lahan.findOne({
      _id: idLahan,
      user: idUser,
    }).select('_id transaksi jumlahPanen');

    const rjumlahPanen = findLahan.jumlahPanen / findLahan.transaksi.length;

    if (findLahan.transaksi[0] == undefined) {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        { rataanJumlahPanen: 0 }
      );
      return 0;
    } else {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        { rataanJumlahPanen: rjumlahPanen }
      );

      return rjumlahPanen;
    }
  },

  updateRJumlahPenjualan: async (idLahan, idUser) => {
    console.log('this is rata jumlah penjualan');
    const findLahan = await Lahan.findOne({
      _id: idLahan,
      user: idUser,
    }).select('_id transaksi jumlahPenjualan');

    const rjumlahPenjualan =
      findLahan.jumlahPenjualan / findLahan.transaksi.length;

    if (findLahan.transaksi[0] == undefined) {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        { rataanHargaJual: 0 }
      );
      return 0;
    } else {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        { rataanHargaJual: rjumlahPenjualan }
      );

      return rjumlahPenjualan;
    }
  },

  checkMulaiPanen: async (idLahan, idUser) => {
    const findLahan = await Lahan.findOne({
      _id: idLahan,
      user: idUser,
    })
      .select('_id transaksi tanggalMulaiPanen')
      .populate('transaksi', '_id tanggalPencatatan');

    if (!findLahan.transaksi[0]) {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        { tanggalMulaiPanen: null }
      );
    } else if (
      findLahan.transaksi[0].tanggalPencatatan !== findLahan.tanggalMulaiPanen
    ) {
      await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        { tanggalMulaiPanen: findLahan.transaksi[0].tanggalPencatatan }
      );
    }
  },

  updateKeuntungan: async (idLahan, idUser) => {
    const findLahan = await Lahan.findOne({
      _id: idLahan,
      user: idUser,
    });

    const keuntungan = findLahan.jumlahPenjualan - findLahan.totalModal;

    await Lahan.findOneAndUpdate(
      { _id: idLahan, user: idUser },
      { keuntungan: keuntungan }
    );
  },

  cekBlanko: async (idUser, tanggalPencatatan, tipeCabai) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (!bulanBlanko) {
      console.log('kesini dulu');
      const teritory = await User.findById(idUser).select(
        '_id provinsi kabupaten kecamatan'
      );

      let blanko = new Blanko2({
        user: idUser,
        tanggalPencatatan,
        tipeCabai,
        provinsi: teritory.provinsi,
        kabupaten: teritory.kabupaten,
        kecamatan: teritory.kecamatan,
      });
      await blanko.save();
      return blanko;
    } else {
      return bulanBlanko;
    }
  },

  updateKolom5: async (idUser, tanggalPencatatan, tipeCabai) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalSelesai: { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalSelesai luasLahan tipeCabai');

    const sum = findLahan.reduce((accumulator, object) => {
      return accumulator + object.luasLahan;
    }, 0);

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        tipeCabai: tipeCabai,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      { luasPanenHabis: sum }
    );
  },

  updateKolom7: async (idUser, tanggalPencatatan, tipeCabai) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalSelesai: null || { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalSelesai luasLahan luasRusak tipeCabai');
    // console.log(findLahan);

    const sum = findLahan.reduce((accumulator, object) => {
      return accumulator + object.luasRusak;
    }, 0);
    // console.log(sum);

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        tipeCabai: tipeCabai,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      { luasRusak: sum }
    );

    await Lahan.updateMany(
      {
        user: idUser,
        tipeCabai: tipeCabai,
        tanggalSelesai: null,
      },
      { luasRusak: 0, persenRusak: 0 }
    );
  },

  updateKolom8: async (idUser, tanggalPencatatan, tipeCabai) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalTanam: { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalTanam luasLahan tipeCabai');

    const sum = findLahan.reduce((accumulator, object) => {
      return accumulator + object.luasLahan;
    }, 0);
    // console.log(findLahan);

    await Blanko2.findOneAndUpdate(
      {
        user: idUser,
        tipeCabai: tipeCabai,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      { luasPenanamanBaru: sum }
    );
  },

  updateKolom10: async (idUser, tanggalPencatatan, tipeCabai) => {
    console.log('sini masuk kolom 10');
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalSelesai: null,
    })
      .select('_id namaLahan tanggalTanam tanggalSelesai transaksi tipeCabai')
      .populate({
        path: 'transaksi',
        select: '_id jumlahDijual tanggalPencatatan',
        match: {
          tanggalPencatatan: { $gte: start, $lte: end },
          jumlahDijual: { $ne: null || undefined },
        },
      });

    // const jumlahPenjualan1 = findLahan.map((item) => item.transaksi);
    // console.log(jumlahPenjualan1);
    if (findLahan.length !== 0) {
      const jumlahPanen = findLahan
        .map((item) =>
          item.transaksi.reduce((accumulator, object) => {
            return accumulator + object.jumlahDijual;
          }, 0)
        )
        .reduce((prev, next) => prev + next);

      // console.log(jumlahPenjualan);
      // console.log(sum1);
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { prodBelumHabis: jumlahPanen }
      );
    }
  },

  updateKolom11: async (idUser, tanggalPencatatan, tipeCabai) => {
    console.log('sini masuk kolom 11');
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalSelesai: { $gte: start, $lte: end },
    })
      .select('_id namaLahan tanggalTanam tanggalSelesai transaksi tipeCabai')
      .populate({
        path: 'transaksi',
        select: '_id jumlahDijual tanggalPencatatan',
        match: {
          tanggalPencatatan: { $gte: start, $lte: end },
          jumlahDijual: { $ne: null || undefined },
        },
      });
    console.log(findLahan);
    // const jumlahPenjualan1 = findLahan.map((item) => item.transaksi);
    // console.log(jumlahPenjualan1);

    if (findLahan.length !== 0) {
      const jumlahPanen = findLahan
        .map((item) =>
          item.transaksi.reduce((accumulator, object) => {
            return accumulator + object.jumlahDijual;
          }, 0)
        )
        .reduce((prev, next) => prev + next);

      // console.log(jumlahPanen);
      // console.log(sum1);
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { prodPanenHabis: jumlahPanen }
      );
    }
  },

  updateKolom12: async (idUser, tanggalPencatatan, tipeCabai) => {
    console.log('sini masuk kolom 12');
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
    })
      .select('_id namaLahan tanggalTanam tanggalSelesai transaksi tipeCabai')
      .populate({
        path: 'transaksi',
        select: '_id jumlahDijual tanggalPencatatan totalProduksi',
        match: {
          tanggalPencatatan: { $gte: start, $lte: end },
          jumlahDijual: { $ne: null || undefined },
        },
      });
    console.log('sampai sini itu findlahan kolom 12');
    console.log(findLahan);
    // const jumlahPenjualan1 = findLahan.map((item) => item.transaksi);
    // console.log(jumlahPenjualan1);

    const jumlahPanen = findLahan
      .map((item) =>
        item.transaksi.reduce((accumulator, object) => {
          return accumulator + object.jumlahDijual;
        }, 0)
      )
      .reduce((prev, next) => prev + next);
    console.log('sampai sini itu jumlah panen');
    console.log(jumlahPanen);

    const totalProd = findLahan
      .map((item) =>
        item.transaksi.reduce((accumulator, object) => {
          return accumulator + object.totalProduksi;
        }, 0)
      )
      .reduce((prev, next) => prev + next);
    console.log('sampai sini itu totalprod');
    console.log(totalProd);

    const sum = totalProd / (jumlahPanen * 100);
    // console.log(jumlahPanen);
    // console.log(totalProd);

    // console.log(sum);
    if (sum > 0) {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { rataHargaJual: sum }
      );
    } else {
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        { rataHargaJual: 0 }
      );
    }
  },

  updateKolom4: async (idUser, tanggalPencatatan, tipeCabai) => {
    console.log('masuk kolom 4');
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
      tipeCabai: tipeCabai,
      tanggalPencatatan: { $gte: prevstart, $lte: prevend },
    });

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (prevbulanBlanko) {
      console.log('masuk sini');
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasTanamanAkhirBulanLalu:
            prevbulanBlanko.luasTanamanAkhirBulanLaporan,
        }
      );
    } else {
      console.log('masuk sana');

      const findLahan = await Lahan.find({
        user: idUser,
        tipeCabai: tipeCabai,
        tanggalSelesai: null,
      }).select('_id namaLahan tanggalTanam luasLahan tipeCabai');

      const sum = findLahan.reduce((accumulator, object) => {
        return accumulator + object.luasLahan;
      }, 0);

      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasTanamanAkhirBulanLalu: sum,
        }
      );
    }
  },

  updateKolom9: async (idUser, tanggalPencatatan, tipeCabai) => {
    console.log('masuk sini 9');
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      tipeCabai: tipeCabai,
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
        tipeCabai: tipeCabai,
        tanggalPencatatan: { $gte: start, $lte: end },
      },
      {
        luasTanamanAkhirBulanLaporan: realsum,
      }
    );
  },

  updateKolom5baru: async (idUser, tanggalPencatatan, tipeCabai) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalSelesai: { $gte: start, $lte: end },
    }).select('_id namaLahan tanggalTanam tanggalSelesai luasLahan tipeCabai');

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (findLahan.length !== 0) {
      const sum = bulanBlanko.luasTanamanAkhirBulanLalu - bulanBlanko.luasRusak;
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenHabis: sum,
        }
      );
    } else {
      console.log('masuk sana');

      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenHabis: 0,
        }
      );
    }
  },

  updateKolom6: async (idUser, tanggalPencatatan, tipeCabai) => {
    const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
    const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

    const start = `${tahun}-${bulan}-01`;
    const end = `${tahun}-${bulan}-31`;

    const findLahan = await Lahan.find({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalSelesai: null,
    }).select('_id namaLahan tanggalTanam tanggalSelesai luasLahan tipeCabai');

    const bulanBlanko = await Blanko2.findOne({
      user: idUser,
      tipeCabai: tipeCabai,
      tanggalPencatatan: { $gte: start, $lte: end },
    });

    if (findLahan.length !== 0) {
      const sum = bulanBlanko.luasTanamanAkhirBulanLalu - bulanBlanko.luasRusak;
      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenBelumHabis: sum,
        }
      );
    } else {
      console.log('masuk sana');

      await Blanko2.findOneAndUpdate(
        {
          user: idUser,
          tipeCabai: tipeCabai,
          tanggalPencatatan: { $gte: start, $lte: end },
        },
        {
          luasPanenBelumHabis: 0,
        }
      );
    }
  },

  // changeStatusAjukan: async (req, res) => {
  //   try {
  //     const id = req.params.transaksiId;
  //     if (!id) {
  //       res.status(404).json({
  //         message: 'Transaksi tidak ditemukan',
  //       });
  //     }

  //     const { tipeCabai, jumlahDijual, hargaJual } = req.body;

  //     let convjumlahDijual = jumlahDijual / 100;

  //     const checkStatus = await Transaksi.findById(id);
  //     console.log(checkStatus.statusTransaksi);

  //     if (checkStatus.statusTransaksi !== statusEnum.diterima) {
  //       const transaksi = await Transaksi.findOneAndUpdate(
  //         { _id: id },
  //         {
  //           tipeCabai,
  //           jumlahDijual: convjumlahDijual,
  //           hargaJual,
  //           statusTransaksi: statusEnum.diajukan,
  //         }
  //       );
  //       res.status(200).json({
  //         message: 'Status Transaksi berhasil dirubah',
  //         status: 'Transaksi diajukan kembali ke Pembeli',
  //         statusTransaksi: statusEnum.diajukan,
  //         alasanDitolak: transaksi.alasanDitolak,
  //         data: transaksi,
  //       });
  //     } else {
  //       res.status(400).json({
  //         message: 'Transaksi sudah diterima pembeli',
  //       });
  //     }
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: error.message || `Internal server error` });
  //     console.log(error);
  //   }
  // },

  // teritoryInfo: async (id) => {
  //   if (id.toString().length === 2) {
  //     let dataProvinsi = await indonesia.getProvinceById(id.toString());
  //     let { latitude, longitude, ...newdataProvinsi } = dataProvinsi;
  //     return newdataProvinsi;
  //   } else if (id.toString().length === 4) {
  //     let dataKabupaten = await indonesia.getRegencyById(id.toString());
  //     let { latitude, longitude, ...newdataKabupaten } = dataKabupaten;
  //     return newdataKabupaten;
  //   } else if (id.toString().length === 7) {
  //     let dataKecamatan = await indonesia.getDistrictById(id.toString());
  //     let { latitude, longitude, ...newdataKecamatan } = dataKecamatan;
  //     return newdataKecamatan;
  //   } else {
  //     return 'data tidak valid';
  //   }
  // },

  // signin: async (req, res) => {
  //   try {
  //     const { account, password } = req.body;

  //     const validateAccount = async () => {
  //       if (!account || !password) {
  //         res.status(404).json({
  //           success: false,
  //           message: 'Semua field wajib diisi',
  //         });
  //       } else {
  //         const findUser = await User.findOne({
  //           $or: [{ email: account }, { phone: account }],
  //         });
  //         if (!findUser) {
  //           res.status(403).json({
  //             success: false,
  //             message: 'Email belum terdaftar',
  //           });
  //         }
  //         return findUser;
  //       }
  //     };

  //     let findAccount = await validateAccount();

  //     const user = await User.findOne({
  //       $or: [{ email: account }, { phone: account }],
  //     });

  //     if (!user) {
  //       res
  //         .status(403)
  //         .json({ success: false, message: 'Email belum terdaftar' });
  //     } else {
  //       const checkPassword = bcrypt.compareSync(password, user.password);

  //       if (checkPassword) {
  //         const token = jwt.sign(
  //           {
  //             id: user.id,
  //             name: user.name,
  //             email: user.email,
  //             phone: user.phone,
  //             role: user.role,
  //           },
  //           config.jwtKey
  //         );
  //         res.status(200).json({
  //           success: true,
  //           message: 'Sign-in Berhasil',
  //           user: {
  //             id: user.id,
  //             name: user.name,
  //             email: user.email,
  //             phone: user.phone,
  //             role: user.role,
  //             access: RoleEnum[user.role],
  //           },
  //           token: token,
  //         });
  //       } else {
  //         res.status(403).json({
  //           message: 'Password yang dimasukkan Salah',
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(500)
  //       .json({ message: error.message || `Internal server error` });
  //   }
  // },
};
