const User = require('./model');
const myFunction = require('../function/function');

module.exports = {
  seeProfile: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myProfile = await User.findById(user).select(
        '_id name email kecamatan kabupaten provinsi alamat role'
      );
      console.log(myProfile[0]);

      res.status(200).json({
        message: 'Berhasil lihat data profil',
        id: myProfile._id,
        name: myProfile.name,
        email: myProfile.email,
        kecamatan: await myFunction.teritoryInfo(myProfile.kecamatan),
        kabupaten: await myFunction.teritoryInfo(myProfile.kabupaten),
        provinsi: await myFunction.teritoryInfo(myProfile.provinsi),
        alamat: myProfile.alamat,
        role: myProfile.role,
      });
    } catch (err) {
      console.log(err);
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
        message: 'Profile berhasil diupdate',
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
    }
  },
};
