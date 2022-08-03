const User = require('./model');
const myFunction = require('../function/function');

module.exports = {
  seeMyProfile: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myProfile = await User.findById(user).select(
        '_id name email kecamatan kabupaten provinsi alamat role'
      );
      console.log(myProfile[0]);

      res.status(200).json({
        message: 'Berhasil melihat Profil',
        id: myProfile._id,
        name: myProfile.name,
        email: myProfile.email,
        kecamatan: await myFunction.teritoryInfo(myProfile.kecamatan),
        kabupaten: await myFunction.teritoryInfo(myProfile.kabupaten),
        provinsi: await myFunction.teritoryInfo(myProfile.provinsi),
        alamat: myProfile.alamat,
        role: myProfile.role,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  getProfilebyID: async (req, res) => {
    try {
      const idUser = req.params.idUser;

      const findUser = await User.findById(idUser).select(
        '_id name email kecamatan kabupaten provinsi alamat role'
      );
      console.log('aman');

      if (!findUser) {
        res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      } else {
        let teritory = await myFunction.teritoryInfo(
          findUser.provinsi,
          findUser.kabupaten,
          findUser.kecamatan
        );

        res.status(200).json({
          success: true,
          message: 'Berhasil melihat Profil',
          data: {
            id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            kecamatan: teritory.detailKecamatan,
            kabupaten: teritory.detailKabupaten,
            provinsi: teritory.detailProvinsi,
            alamat: findUser.alamat,
            role: findUser.role,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        succes: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  editProfile: async (req, res) => {
    try {
      const idUser = req.userData.id;

      const { name, kecamatan, kabupaten, provinsi, alamat } = req.body;

      const findUser = await User.findOneAndUpdate(
        { _id: idUser },
        { name, kecamatan, kabupaten, provinsi, alamat },
        { new: true }
      );

      let teritory = await myFunction.teritoryInfo(
        findUser.provinsi,
        findUser.kabupaten,
        findUser.kecamatan
      );

      res.status(201).json({
        success: true,
        message: 'Berhasil mengedit Profil',
        data: {
          id: findUser._id,
          name: findUser.name,
          email: findUser.email,
          kecamatan: teritory.detailKecamatan,
          kabupaten: teritory.detailKabupaten,
          provinsi: teritory.detailProvinsi,
          alamat: findUser.alamat,
          role: findUser.role,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getPetani: async (req, res) => {
    try {
      const findPetani = await User.find({ role: 'petani' }).select(
        '_id name email kecamatan kabupaten provinsi alamat role'
      );

      res.status(200).json({
        success: true,
        message: 'Berhasil melihat akun Petani',
        data: findPetani,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getPedagangbyTipe: async (req, res) => {
    try {
      const tipePedagang = req.params.tipepedagang;

      let pedagang = ['pengepul', 'pengecer', 'distributor', 'agen', 'grosir'];
      let isPedagang = pedagang.includes(tipePedagang);

      if (!isPedagang) {
        res.status(404).json({
          success: false,
          message: 'Bukan merupakan tipe akun Pedagang',
        });
      } else {
        const findPedagang = await User.find({
          role: tipePedagang,
        }).select('_id name');

        res.status(200).json({
          success: true,
          message: `Berhasil melihat daftar pedagang dengan tipe ${tipePedagang}`,
          data: findPedagang,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: error.message || `Internal server error`,
        });
    }
  },
};
