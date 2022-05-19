const Supervisi = require('./model');
const User = require('../users/model');

module.exports = {
  createSupervisi: async (req, res) => {
    try {
      console.log(req.userData.id);
      const { petani } = req.body;

      const petugas = req.userData.id;

      const checkPetani = await Supervisi.findOne({
        petugas: petugas,
        petani: petani,
      });
      console.log(checkPetani);

      if (!checkPetani) {
        let supervisi = await Supervisi.findOneAndUpdate(
          { petugas: petugas },
          { $push: { petani: petani } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ).populate('petugas', '_id name role');

        res.status(201).json({
          message: 'berhasil tambah petani untuk di supervisi',
          id: supervisi._id,
          petugas: supervisi.petugas,
          petani: await User.findOne({ _id: petani }, '_id name role'),
        });
      } else {
        res.status(409).json({
          message: 'petani sudah menjadi list supervisi',
        });
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
        .populate(
          'petani',
          '_id name email password'
        );

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
