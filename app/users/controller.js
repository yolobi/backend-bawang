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

  seeProfile: async (req, res) => {
    try {
      const user = req.params.userId;
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

  editProfile: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const { name, email, kecamatan, kabupaten, provinsi, alamat, role } =
        req.body;

      const myProfile = await User.findOneAndUpdate(
        { _id: user },
        { name, email, kecamatan, kabupaten, provinsi, alamat, role }
      );

      res.status(201).json({
        message: 'Berhasil mengupdate Profil',
        name: name,
        email: email,
        kecamatan: await myFunction.teritoryInfo(kecamatan),
        kabupaten: await myFunction.teritoryInfo(kabupaten),
        provinsi: await myFunction.teritoryInfo(provinsi),
        alamat: alamat,
        role: role,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seePetani: async (req, res) => {
    try {
      const petani = await User.find({ role: 'petani' }).select(
        '_id name email kecamatan kabupaten provinsi alamat role'
      );

      res.status(200).json({
        message: 'Berhasil melihat akun Petani',
        data: petani,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seePedagang: async (req, res) => {
    try {
      const tipePedagang = req.params.tipepedagang;
      console.log(tipePedagang);

      let pedagang = ['pengepul', 'pengecer', 'distributor', 'agen', 'grosir'];
      let isPedagang = pedagang.includes(tipePedagang);

      if (isPedagang) {
        const dataPedagang = await User.find({ role: tipePedagang }).select(
          '_id name'
        );
        res.status(200).json({
          tipePedagang: tipePedagang,
          pedagang: dataPedagang,
        });
      } else {
        res.status(404).json({
          message: 'Bukan merupakan tipe akun Pedagang',
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
