const Blanko = require('./model');
const User = require('../users/model');
const myFunction = require('../function/function');
const lihatFunction = require('../function/lihatBlanko');
const Transaksi = require('../transaksi2/model');
const ExcelJS = require('exceljs');
const axios = require('axios');

module.exports = {
  exportBlanko: async (req, res) => {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile('app/blanko2/TEMPLATE_BLANKO.xlsx');
      const worksheet = workbook.getWorksheet('Sheet1');
      const { bulan, tahun } = req.query;

      const idUser = req.userData.id;
      const user = await User.findById(idUser).select(
        '_id provinsi kabupaten kecamatan'
      );

      let provinsi = '';
      let kabupaten = '';
      let kecamatan = '';

      await axios
        .all([
          await axios.get(
            'https://emsifa.github.io/api-wilayah-indonesia/api/province/' +
              user.provinsi +
              '.json'
          ),
          await axios.get(
            'https://emsifa.github.io/api-wilayah-indonesia/api/regency/' +
              user.kabupaten +
              '.json'
          ),
          await axios.get(
            'https://emsifa.github.io/api-wilayah-indonesia/api/district/' +
              user.kecamatan +
              '.json'
          ),
        ])
        .then(
          axios.spread((response1, response2, response3) => {
            provinsi = response1.data.name;
            kabupaten = response2.data.name;
            kecamatan = response3.data.name;
          })
        )
        .catch((error) => {
          console.log(error);
        });

      const cellProvinsi = worksheet.getCell('C4');
      cellProvinsi.value = provinsi;

      const cellKabupaten = worksheet.getCell('C5');
      cellKabupaten.value = kabupaten;

      const cellKecamatan = worksheet.getCell('C6');
      cellKecamatan.value = kecamatan;

      const cellBulan = worksheet.getCell('L5');
      cellBulan.value = bulan;

      const cellTahun = worksheet.getCell('L6');
      cellTahun.value = tahun;

      const today = new Date();
      const startDate = new Date(
        `${today.getFullYear()}-${today.toISOString().slice(5, 7)}-01`
      );
      const endDate = new Date(
        `${today.getFullYear()}-${today.toISOString().slice(5, 7)}-31`
      );

      //Bawang Merah
      const bawangMerah = await Blanko.findOne({
        komoditas: 'bawangMerah',
        updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      if (bawangMerah) {
        const luasTanamanAkhirBulanLalu = worksheet.getCell('D12');
        luasTanamanAkhirBulanLalu.value = bawangMerah.luasTanamanAkhirBulanLalu;

        const luasPanenHabis = worksheet.getCell('E12');
        luasPanenHabis.value = bawangMerah.luasPanenHabis;

        const luasPanenBelumHabis = worksheet.getCell('F12');
        luasPanenBelumHabis.value = bawangMerah.luasPanenBelumHabis;

        const luasRusak = worksheet.getCell('G12');
        luasRusak.value = bawangMerah.luasRusak;

        const luasPenanamanBaru = worksheet.getCell('H12');
        luasPenanamanBaru.value = bawangMerah.luasPenanamanBaru;

        const luasTanamanAkhirBulanLaporan = worksheet.getCell('I12');
        luasTanamanAkhirBulanLaporan.value =
          bawangMerah.luasTanamanAkhirBulanLaporan;

        const prodPanenHabis = worksheet.getCell('J12');
        prodPanenHabis.value = bawangMerah.prodPanenHabis;

        const prodBelumHabis = worksheet.getCell('K12');
        prodBelumHabis.value = bawangMerah.prodBelumHabis;

        const rataHargaJual = worksheet.getCell('L12');
        rataHargaJual.value = bawangMerah.rataHargaJual;
      }

      //Bawang Putih
      const bawangPutih = await Blanko.findOne({
        komoditas: 'bawangPutih',
        updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      if (bawangPutih) {
        const luasTanamanAkhirBulanLalu = worksheet.getCell('D12');
        luasTanamanAkhirBulanLalu.value = bawangPutih.luasTanamanAkhirBulanLalu;

        const luasPanenHabis = worksheet.getCell('E12');
        luasPanenHabis.value = bawangPutih.luasPanenHabis;

        const luasPanenBelumHabis = worksheet.getCell('F12');
        luasPanenBelumHabis.value = bawangPutih.luasPanenBelumHabis;

        const luasRusak = worksheet.getCell('G12');
        luasRusak.value = bawangPutih.luasRusak;

        const luasPenanamanBaru = worksheet.getCell('H12');
        luasPenanamanBaru.value = bawangPutih.luasPenanamanBaru;

        const luasTanamanAkhirBulanLaporan = worksheet.getCell('I12');
        luasTanamanAkhirBulanLaporan.value =
          bawangPutih.luasTanamanAkhirBulanLaporan;

        const prodPanenHabis = worksheet.getCell('J12');
        prodPanenHabis.value = bawangPutih.prodPanenHabis;

        const prodBelumHabis = worksheet.getCell('K12');
        prodBelumHabis.value = bawangPutih.prodBelumHabis;

        const rataHargaJual = worksheet.getCell('L12');
        rataHargaJual.value = bawangPutih.rataHargaJual;
      }

      //Cabai Besar
      const cabaiMerahBesar = await Blanko.findOne({
        komoditas: 'cabaiMerahBesar',
        updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      if (cabaiMerahBesar) {
        const luasTanamanAkhirBulanLalu = worksheet.getCell('D12');
        luasTanamanAkhirBulanLalu.value =
          cabaiMerahBesar.luasTanamanAkhirBulanLalu;

        const luasPanenHabis = worksheet.getCell('E12');
        luasPanenHabis.value = cabaiMerahBesar.luasPanenHabis;

        const luasPanenBelumHabis = worksheet.getCell('F12');
        luasPanenBelumHabis.value = cabaiMerahBesar.luasPanenBelumHabis;

        const luasRusak = worksheet.getCell('G12');
        luasRusak.value = cabaiMerahBesar.luasRusak;

        const luasPenanamanBaru = worksheet.getCell('H12');
        luasPenanamanBaru.value = cabaiMerahBesar.luasPenanamanBaru;

        const luasTanamanAkhirBulanLaporan = worksheet.getCell('I12');
        luasTanamanAkhirBulanLaporan.value =
          cabaiMerahBesar.luasTanamanAkhirBulanLaporan;

        const prodPanenHabis = worksheet.getCell('J12');
        prodPanenHabis.value = cabaiMerahBesar.prodPanenHabis;

        const prodBelumHabis = worksheet.getCell('K12');
        prodBelumHabis.value = cabaiMerahBesar.prodBelumHabis;

        const rataHargaJual = worksheet.getCell('L12');
        rataHargaJual.value = cabaiMerahBesar.rataHargaJual;
      }

      //Cabai Keriting
      const cabaiMerahKeriting = await Blanko.findOne({
        komoditas: 'cabaiMerahKeriting',
        updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      if (cabaiMerahKeriting) {
        const luasTanamanAkhirBulanLalu = worksheet.getCell('D12');
        luasTanamanAkhirBulanLalu.value =
          cabaiMerahKeriting.luasTanamanAkhirBulanLalu;

        const luasPanenHabis = worksheet.getCell('E12');
        luasPanenHabis.value = cabaiMerahKeriting.luasPanenHabis;

        const luasPanenBelumHabis = worksheet.getCell('F12');
        luasPanenBelumHabis.value = cabaiMerahKeriting.luasPanenBelumHabis;

        const luasRusak = worksheet.getCell('G12');
        luasRusak.value = cabaiMerahKeriting.luasRusak;

        const luasPenanamanBaru = worksheet.getCell('H12');
        luasPenanamanBaru.value = cabaiMerahKeriting.luasPenanamanBaru;

        const luasTanamanAkhirBulanLaporan = worksheet.getCell('I12');
        luasTanamanAkhirBulanLaporan.value =
          cabaiMerahKeriting.luasTanamanAkhirBulanLaporan;

        const prodPanenHabis = worksheet.getCell('J12');
        prodPanenHabis.value = cabaiMerahKeriting.prodPanenHabis;

        const prodBelumHabis = worksheet.getCell('K12');
        prodBelumHabis.value = cabaiMerahKeriting.prodBelumHabis;

        const rataHargaJual = worksheet.getCell('L12');
        rataHargaJual.value = cabaiMerahKeriting.rataHargaJual;
      }

      //Cabai Rawit
      const cabaiRawitMerah = await Blanko.findOne({
        komoditas: 'cabaiRawitMerah',
        updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      if (cabaiRawitMerah) {
        const luasTanamanAkhirBulanLalu = worksheet.getCell('D12');
        luasTanamanAkhirBulanLalu.value =
          cabaiRawitMerah.luasTanamanAkhirBulanLalu;

        const luasPanenHabis = worksheet.getCell('E12');
        luasPanenHabis.value = cabaiRawitMerah.luasPanenHabis;

        const luasPanenBelumHabis = worksheet.getCell('F12');
        luasPanenBelumHabis.value = cabaiRawitMerah.luasPanenBelumHabis;

        const luasRusak = worksheet.getCell('G12');
        luasRusak.value = cabaiRawitMerah.luasRusak;

        const luasPenanamanBaru = worksheet.getCell('H12');
        luasPenanamanBaru.value = cabaiRawitMerah.luasPenanamanBaru;

        const luasTanamanAkhirBulanLaporan = worksheet.getCell('I12');
        luasTanamanAkhirBulanLaporan.value =
          cabaiRawitMerah.luasTanamanAkhirBulanLaporan;

        const prodPanenHabis = worksheet.getCell('J12');
        prodPanenHabis.value = cabaiRawitMerah.prodPanenHabis;

        const prodBelumHabis = worksheet.getCell('K12');
        prodBelumHabis.value = cabaiRawitMerah.prodBelumHabis;

        const rataHargaJual = worksheet.getCell('L12');
        rataHargaJual.value = cabaiRawitMerah.rataHargaJual;
      }

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment;filename=' + 'blanko.xlsx'
      );

      workbook.xlsx.write(res);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },
  addBlankoCadangan: async (req, res) => {
    try {
      const { tanggalPencatatan } = req.body;
      const idUser = req.userData.id;

      // parsing tanggalPencatatan -> bulan dan tahun ini
      const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
      const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

      const start = `${tahun}-${bulan}-01`;
      const end = `${tahun}-${bulan}-31`;

      //Cek blanko bulan ini udah ada atau belum
      const isBlankoCreated = await Blanko2.find({
        user: idUser,
        tanggalPencatatan: { $gte: start, $lte: end },
      });

      //kalau sudah ada
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  addBlanko: async (req, res) => {
    try {
      const { tanggalPencatatan, komoditas } = req.body;

      const idUser = req.userData.id;

      // cek apakah blanko sudah pernah dibuat
      const blanko = await myFunction.cekBlanko(
        idUser,
        tanggalPencatatan,
        komoditas
      );

      const isTransaksi = await Transaksi.findOne({ penjual: idUser });

      if (!isTransaksi) {
        await myFunction.updateKolom8(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom4(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom9(idUser, tanggalPencatatan, komoditas);
        res.status(201).json({
          success: true,
          message:
            'Berhasil menambahkan Blanko, Belum ada transaksi yang dilakukan',
          data: blanko,
        });
      } else if (blanko) {
        console.log('masuk inituh');
        await myFunction.updateKolom7(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom8(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom4(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom10(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom11(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom12(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom5baru(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom6(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom9(idUser, tanggalPencatatan, komoditas);

        res.status(201).json({
          success: true,
          message: 'Berhasil menambahkan Blanko',
          data: blanko,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Gagal menambahkan Blanko, Blanko telah dibuat',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  checkIsianBlanko: async (req, res) => {
    try {
      const { tanggalPencatatan, komoditas } = req.body;

      const idUser = req.userData.id;

      const blanko = await myFunction.cekBlanko(
        idUser,
        tanggalPencatatan,
        komoditas
      );

      const isTransaksi = await Transaksi.findOne({ penjual: idUser });

      const userDetail = await User.findById(idUser).select('_id name role');

      if (!isTransaksi) {
        const kolom8 = await lihatFunction.lihatKolom8(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom4 = await lihatFunction.lihatKolom4(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom9 = await lihatFunction.lihatKolom9(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        res.status(200).json({
          success: true,
          message:
            'Berhasil melihat isian blanko, Belum ada transaksi yang dilakukan',
          user: userDetail,
          id: blanko._id,
          tanggalPencatatan: blanko.tanggalPencatatan,
          komoditas: blanko.komoditas,
          luasTanamanAkhirBulanLalu: kolom4,
          luasPanenHabis: blanko.luasPanenHabis,
          luasPanenBelumHabis: blanko.luasPanenHabis,
          luasRusak: blanko.luasRusak,
          luasPenanamanBaru: kolom8,
          luasTanamanAkhirBulanLaporan: kolom9,
          prodPanenHabis: blanko.prodPanenHabis,
          prodBelumHabis: blanko.prodBelumHabis,
          rataHargaJual: blanko.rataHargaJual,
          kecamatan: blanko.kecamatan,
          kabupaten: blanko.kabupaten,
          provinsi: blanko.provinsi,
        });
      } else if (blanko) {
        const kolom7 = await lihatFunction.lihatKolom7(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom8 = await lihatFunction.lihatKolom8(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom4 = await lihatFunction.lihatKolom4(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom10 = await lihatFunction.lihatKolom10(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom11 = await lihatFunction.lihatKolom11(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom12 = await lihatFunction.lihatKolom12(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom5 = await lihatFunction.lihatKolom5baru(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom6 = await lihatFunction.lihatKolom6(
          idUser,
          tanggalPencatatan,
          komoditas
        );
        const kolom9 = await lihatFunction.lihatKolom9(
          idUser,
          tanggalPencatatan,
          komoditas
        );

        res.status(200).json({
          success: true,
          message: 'Berhasil melihat isian blanko yang akan dikirim',
          user: userDetail,
          id: blanko._id,
          tanggalPencatatan: blanko.tanggalPencatatan,
          komoditas: blanko.komoditas,
          luasTanamanAkhirBulanLalu: kolom4,
          luasPanenHabis: kolom5,
          luasPanenBelumHabis: kolom6,
          luasRusak: kolom7,
          luasPenanamanBaru: kolom8,
          luasTanamanAkhirBulanLaporan: kolom9,
          prodPanenHabis: kolom10,
          prodBelumHabis: kolom11,
          rataHargaJual: kolom12,
          kecamatan: blanko.kecamatan,
          kabupaten: blanko.kabupaten,
          provinsi: blanko.provinsi,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Gagal menambahkan Blanko, Blanko telah dibuat',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  sinkronBlanko: async (req, res) => {
    try {
      const { tanggalPencatatan, komoditas } = req.body;

      const idUser = req.userData.id;

      const bulan = new Date(tanggalPencatatan).toISOString().slice(5, 7);
      const tahun = new Date(tanggalPencatatan).toISOString().slice(0, 4);

      const start = `${tahun}-${bulan}-01`;
      const end = `${tahun}-${bulan}-31`;

      const bulanBlanko = await Blanko.findOne({
        user: idUser,
        komoditas: komoditas,
        tanggalPencatatan: { $gte: start, $lte: end },
      });

      const isTransaksi = await Transaksi.findOne({ penjual: idUser });

      if (!isTransaksi) {
        await myFunction.updateKolom8(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom4(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom9(idUser, tanggalPencatatan, komoditas);

        const hasilUpdate = await Blanko.findOne({
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        });
        res.status(200).json({
          success: true,
          message: 'Berhasil menambahkan Blanko 1',
          data: hasilUpdate,
        });
      } else if (bulanBlanko) {
        await myFunction.updateKolom7(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom8(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom4(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom10(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom11(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom12(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom5baru(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom6(idUser, tanggalPencatatan, komoditas);
        await myFunction.updateKolom9(idUser, tanggalPencatatan, komoditas);

        const hasilUpdate = await Blanko.findOne({
          user: idUser,
          komoditas: komoditas,
          tanggalPencatatan: { $gte: start, $lte: end },
        });
        res.status(201).json({
          success: true,
          message: 'Berhasil menambahkan Blanko',
          data: hasilUpdate,
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Gagal menambahkan Blanko, Blanko bulan ini belum dibuat',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getBlankoAll: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const findBlanko = await Blanko.find({ user: idUser })
        .populate('user', '_id name role')
        .sort({
          tanggalPencatatan: 'descending',
          createdAt: 'descending',
        });

      if (findBlanko.length == 0 || !findBlanko) {
        res.status(404).json({
          success: false,
          message: 'Belum ada Blanko yang diinput',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Blanko',
          data: findBlanko,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getBlankobyID: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idBlanko = req.params.idBlanko;

      const findBlanko = await Blanko.findOne({
        user: idUser,
        _id: idBlanko,
      }).populate('user', '_id name role');

      if (!findBlanko) {
        res.status(404).json({
          success: false,
          message: 'Blanko tidak ditemukan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Blanko',
          data: findBlanko,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },
};
