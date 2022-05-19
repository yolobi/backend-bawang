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
        res.status(400).json({ message: 'Email not registered' });
      } else if (!onSupervise) {
        res.status(400).json({
          message:
            'Bukan merupakan akun yang anda akuisisi, Silahkan akuisisi terlebih dahulu',
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
            message: 'Signin success',
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
            message: 'Incorrect password',
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

  createSupervisi: async (req, res) => {
    try {
      console.log(req.userData.id);
      const petugas = req.userData.id;

      const { email, password } = req.body;

      const user = await User.findOne({ email: email, role: 'petani' });
      console.log(user);
      if (!user) {
        res.status(403).json({ message: 'Email not registered or not petani' });
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
          const checkPetani = await Supervisi.findOne({
            petugas: petugas,
            petani: petani,
          });
          if (!checkPetani) {
            let supervisi = await Supervisi.findOneAndUpdate(
              { petugas: petugas },
              { $push: { petani: petani } },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            ).populate('petugas', '_id name role');

            res.status(201).json({
              message: 'berhasil tambah petani untuk di supervisi',
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
            res.status(409).json({
              message: 'petani sudah menjadi list supervisi',
            });
          }
        } else {
          res.status(403).json({
            message: 'Incorrect password',
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
        res.status(201).json({ message: 'Belum ada petani yang di supervisi' });
      }

      let supervisi = await Supervisi.findOne({ petugas: petugas })
        .populate('petugas', '_id name role')
        .populate('petani', '_id name email password');

      res.status(201).json({
        message: 'berhasil lihat daftar petani yang di supervisi',
        id: supervisi._id,
        petugas: supervisi.petugas,
        petani: supervisi.petani,
      });
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
          message: 'berhasil hapus petani untuk di supervisi',
          id: supervisi._id,
          petugas: supervisi.petugas,
          petani: await User.findOne({ _id: petani }, '_id name role'),
        });
      } else {
        res.status(404).json({
          message: 'petani tidak ditemukan pada list supervisi',
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
