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

  updateJumlahPanen: async (idLahan, idUser) => {
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
      const teritory = await User.findById(idUser).select(
        '_id provinsi kabupaten kecamatan'
      );
      console.log(teritory);

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
    }
  },
};
