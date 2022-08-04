const Supervisi = require('./model');
const User = require('../users/model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

const RoleEnum = Object.freeze({
  petani: 'petani',
  agen: 'pedagang',
  distributor: 'pedagang',
  pengepul: 'pedagang',
  pengecer: 'pedagang',
  grosir: 'pedagang',
  pdh: 'pdh',
  dinasPetanianKota: 'dinas',
  dinasPertanianKabupaten: 'dinas',
});

module.exports = {
  addSupervisi: async (req, res) => {
    try {
      const idPetugas = req.userData.id;

      const { account, password } = req.body;
      if (!account || !password)
        return res.status(404).json({
          success: false,
          message: 'Semua field wajib diisi',
        });

      const findUser = await User.findOne({
        $or: [{ email: account }, { phone: account }],
        role: 'petani',
      });
      if (!findUser)
        return res.status(403).json({
          success: false,
          message:
            'Email belum terdaftar atau bukan merupakan akun dengan role Petani',
        });

      const checkPassword = await bcrypt.compare(password, findUser.password);
      if (!checkPassword)
        return res.status(403).json({
          success: false,
          message: 'Password yang dimasukkan Salah',
        });

      const token = jwt.sign(
        {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
        },
        config.jwtKey
      );

      let addPetanitoSupervisi = await Supervisi.findOneAndUpdate(
        { petugas: idPetugas },
        { $addToSet: { petani: findUser._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).populate('petugas', '_id name role');

      res.status(201).json({
        success: true,
        message: 'Berhasil menambahkan akun Petani untuk di Supervisi',
        data: {
          _id: addPetanitoSupervisi._id,
          petugas: addPetanitoSupervisi.petugas,
          petani: {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role,
            access: RoleEnum[findUser.role],
          },
        },
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getSupervisiAll: async (req, res) => {
    try {
      const idPetugas = req.userData.id;

      const findSupervisi = await Supervisi.find({
        petugas: idPetugas,
      })
        .populate('petugas', '_id name role')
        .populate('petani', '_id name email password');

      res.status(200).json({
        success: true,
        message: 'Berhasil melihat daftar akun Petani yang di Supervisi',
        data: findSupervisi,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  signinSupervise: async (req, res) => {
    try {
      const petugas = req.userData.id;
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });
      console.log(user);

      const onSupervise = await Supervisi.findOne({
        petugas: petugas,
        petani: user.id,
      });
      console.log(onSupervise);

      if (!user) {
        res.status(400).json({ message: 'Email belum terdaftar' });
      } else if (!onSupervise) {
        res.status(400).json({
          message:
            'Bukan merupakan akun Petani yang anda akuisisi, Silahkan akuisisi terlebih dahulu',
        });
      } else {
        const supervisi = await Supervisi.findOne({
          petani: user._id,
        }).populate('petugas', '_id name');
        if (user.password === password) {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            config.jwtKey
          );
          res.status(200).json({
            message: 'Sign-in Berhasil',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              access: RoleEnum[user.role],
            },
            petugas: {
              id: supervisi.petugas._id,
              name: supervisi.petugas.name,
            },
            token: token,
          });
        } else {
          res.status(403).json({
            message: 'Password yang dimasukkan Salah',
          });
        }
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  signinSuperviseId: async (req, res) => {
    try {
      const petugas = req.userData.id;
      const petani = req.params.userId;

      const user = await User.findById(petani);
      console.log(user);

      const onSupervise = await Supervisi.findOne({
        petugas: petugas,
        petani: petani,
      });
      console.log(onSupervise);

      if (!user) {
        res.status(400).json({ message: 'User tidak ditemukan' });
      } else if (!onSupervise) {
        res.status(400).json({
          message:
            'Bukan merupakan akun Petani yang anda akuisisi, Silahkan akuisisi terlebih dahulu',
        });
      } else {
        const supervisi = await Supervisi.findOne({
          petani: user._id,
        }).populate('petugas', '_id name');

        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          config.jwtKey
        );
        res.status(200).json({
          message: 'Sign-in Berhasil',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            access: RoleEnum[user.role],
          },
          petugas: {
            id: supervisi.petugas._id,
            name: supervisi.petugas.name,
          },
          token: token,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  deleteSupervisi: async (req, res) => {
    try {
      const idPetani = req.params.idPetani;
      const idPetugas = req.userData.id;

      let findSupervisi = await Supervisi.findOneAndUpdate(
        { petugas: idPetugas },
        { $pull: { petani: idPetani } }
      ).populate('petugas', '_id name role');

      if (!findSupervisi)
        return res.status(404).json({
          success: false,
          message:
            'Akun Petani tidak ditemukan pada list akun yang di Supervisi',
        });

      let petaniDetail = await User.findOne({ _id: idPetani }).select(
        '_id name email phone role'
      );

      res.status(200).json({
        success: true,
        message: 'Berhasil menghapus akun Petani untuk di Supervisi',
        data: {
          _id: findSupervisi._id,
          petugas: findSupervisi.petugas,
          petani: petaniDetail,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          success: false,
          message: error.message || `Internal server error`,
        });
    }
  },
};
