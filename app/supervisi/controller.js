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
      const petani = req.params.userId

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

  createSupervisi: async (req, res) => {
    try {
      console.log(req.userData.id);
      const petugas = req.userData.id;

      const { email, password } = req.body;

      const user = await User.findOne({ email: email, role: 'petani' });
      console.log(user);
      if (!user) {
        res.status(403).json({ message: 'Email belum terdaftar atau bukan merupakan akun Petani' });
      } else {
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            config.jwtKey
          );

          const petani = user._id;

          let supervisi = await Supervisi.findOneAndUpdate(
            { petugas: petugas },
            { $addToSet: { petani: petani } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          ).populate('petugas', '_id name role');

          res.status(201).json({
            message: 'Berhasil menambahkan akun Petani untuk di Supervisi',
            supervisiId: supervisi._id,
            petugas: supervisi.petugas,
            petani: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              access: RoleEnum[user.role],
            },
            token: token,
          });
        } else {
          res.status(403).json({
            message: 'Password yang dimasukkan salah',
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

  seeMySupervisi: async (req, res) => {
    try {
      const petugas = req.userData.id;

      const checkPetugas = await Supervisi.findOne({
        petugas: petugas,
      });
      console.log(checkPetugas);

      if (!checkPetugas) {
        res.status(201).json({ message: 'Belum ada akun Petani yang di Supervisi' });
      } else {
        let supervisi = await Supervisi.findOne({ petugas: petugas })
          .populate('petugas', '_id name role')
          .populate('petani', '_id name email password');

        res.status(201).json({
          message: 'Berhasil melihat daftar akun Petani yang di Supervisi',
          id: supervisi._id,
          petugas: supervisi.petugas,
          petani: supervisi.petani,
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
      console.log(req.userData.id);
      const petani = req.params.petaniId;
      const petugas = req.userData.id;

      const checkPetani = await Supervisi.findOne({
        petugas: petugas,
        petani: petani,
      });
      console.log(checkPetani);

      if (checkPetani) {
        let supervisi = await Supervisi.findOneAndUpdate(
          { petugas: petugas },
          { $pull: { petani: petani } }
        ).populate('petugas', '_id name role');

        res.status(200).json({
          message: 'Berhasil menghapus akun Petani untuk di Supervisi',
          id: supervisi._id,
          petugas: supervisi.petugas,
          petani: await User.findOne({ _id: petani }, '_id name role'),
        });
      } else {
        res.status(404).json({
          message: 'Akun Petani tidak ditemukan pada list akun yang di Supervisi',
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
