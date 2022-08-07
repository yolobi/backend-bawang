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
            'Email/Nomor telepon belum terdaftar atau bukan merupakan akun dengan role Petani',
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
          email: findUser.email || false,
          phone: findUser.phone || false,
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
            email: findUser.email || false,
            phone: findUser.phone || false,
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
        .populate('petani', '_id name email phone password');

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

  loginSupervisi: async (req, res) => {
    try {
      const idPetugas = req.userData.id;
      const { account, password } = req.body;

      const findUser = await User.findOne({
        $or: [{ email: account }, { phone: account }],
        role: 'petani',
      });
      console.log(findUser);

      const isOnSupervise = await Supervisi.findOne({
        petugas: idPetugas,
        petani: findUser.id,
      });
      console.log(isOnSupervise);

      if (!findUser) {
        return res.status(404).json({
          success: false,
          message:
            'Email belum terdaftar atau bukan merupakan akun dengan role Petani',
        });
      } else if (!isOnSupervise) {
        res.status(400).json({
          success: false,
          message:
            'Bukan merupakan akun Petani yang anda akuisisi, Silahkan akuisisi terlebih dahulu',
        });
      } else {
        const supervisi = await Supervisi.findOne({
          petani: findUser._id,
        }).populate('petugas', '_id name');
        if (findUser.password === password) {
          const token = jwt.sign(
            {
              id: findUser.id,
              name: findUser.name,
              email: findUser.email || false,
              phone: findUser.phone || false,
              role: findUser.role,
            },
            config.jwtKey
          );
          res.status(200).json({
            success: true,
            message: 'Login Berhasil',
            data: {
              user: {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email || false,
                phone: findUser.phone || false,
                role: findUser.role,
                access: RoleEnum[findUser.role],
              },
              petugas: {
                id: supervisi.petugas._id,
                name: supervisi.petugas.name,
              },
            },
            token: token,
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'Password yang dimasukkan Salah',
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  loginSupervisibyID: async (req, res) => {
    try {
      const idPetugas = req.userData.id;
      const idPetani = req.params.idUser;

      const findUser = await User.findById(idPetani);

      const isOnSupervise = await Supervisi.findOne({
        petugas: idPetugas,
        petani: idPetani,
      });

      if (!findUser) {
        return res.status(404).json({
          success: false,
          message:
            'Email belum terdaftar atau bukan merupakan akun dengan role Petani',
        });
      } else if (!isOnSupervise) {
        res.status(400).json({
          success: false,
          message:
            'Bukan merupakan akun Petani yang anda akuisisi, Silahkan akuisisi terlebih dahulu',
        });
      } else {
        const supervisi = await Supervisi.findOne({
          petani: findUser._id,
        }).populate('petugas', '_id name');

        const token = jwt.sign(
          {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email || false,
            phone: findUser.phone || false,
            role: findUser.role,
          },
          config.jwtKey
        );
        res.status(200).json({
          success: true,
          message: 'Sign-in Berhasil',
          data: {
            user: {
              id: findUser.id,
              name: findUser.name,
              email: findUser.email || false,
              phone: findUser.phone || false,
              role: findUser.role,
              access: RoleEnum[findUser.role],
            },
            petugas: {
              id: supervisi.petugas._id,
              name: supervisi.petugas.name,
            },
          },
          token: token,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
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
      res.status(500).json({
        success: false,
        message: error.message || `Internal server error`,
      });
    }
  },
};
