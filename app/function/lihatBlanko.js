const indonesia = require('territory-indonesia');
const Transaksi2 = require('../transaksi2/model');
const User = require('../users/model');
const Lahan = require('../lahan/model');
const Blanko2 = require('../blanko2/model');

module.exports = {
  lihatKolom5: async (idUser, tanggalPencatatan, tipeCabai) => {
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

    return sum;
  },

  lihatKolom7: async (idUser, tanggalPencatatan, tipeCabai) => {
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

    return sum;
  },

  lihatKolom8: async (idUser, tanggalPencatatan, tipeCabai) => {
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

    return sum;
  },

  lihatKolom10: async (idUser, tanggalPencatatan, tipeCabai) => {
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

      return jumlahPanen;

      // console.log('ini kolom 10 jumlah panen');
      // console.log(jumlahPanen);
      // console.log(sum1);
    } else {
      return 0;
    }
  },

  lihatKolom11: async (idUser, tanggalPencatatan, tipeCabai) => {
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
      return jumlahPanen;
      // console.log(jumlahPanen);
      // console.log(sum1);
    } else{
      return 0
    }
  },

  lihatKolom12: async (idUser, tanggalPencatatan, tipeCabai) => {
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
    return sum;
  },

  lihatKolom4: async (idUser, tanggalPencatatan, tipeCabai) => {
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
      return prevbulanBlanko.luasTanamanAkhirBulanLaporan;
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

      return sum;
    }
  },

  lihatKolom9: async (idUser, tanggalPencatatan, tipeCabai) => {
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

    return realsum;
  },

  lihatKolom5baru: async (idUser, tanggalPencatatan, tipeCabai) => {
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
      return sum;
    } else {
      console.log('masuk sana');

      return 0;
    }
  },

  lihatKolom6: async (idUser, tanggalPencatatan, tipeCabai) => {
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
      return sum;
    } else {
      console.log('masuk sana');

      return 0;
    }
  },
};
