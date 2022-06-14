const Tanam = require('./model');
const User = require('../users/model');

const statusEnum = Object.freeze({
  active: '0',
  finish: '1',
});

module.exports = {
  createTanam: async (req, res) => {
    try {
      const { tipeCabai, namaLahan, tanggalPenanaman, jumlahTanam } = req.body;

      const user = req.userData.id;
      console.log(user);

      let tanam = new Tanam({
        user,
        tipeCabai,
        namaLahan,
        tanggalPenanaman,
        jumlahTanam,
      });
      await tanam.save();

      res.status(201).json({
        message: 'Berhasil menambahkan Lahan',
        data: tanam,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeMyTanam: async (req, res) => {
    try {
      const user = req.userData.id;
      console.log(user);

      const myTanam = await Tanam.find({ user: user })
        .select(
          '_id tanggalPenanaman tipeCabai namaLahan jumlahTanam statusLahan createdAt'
        )
        .sort({
          tanggalPenanaman: 'descending',
          createdAt: 'descending',
        });
      console.log(myTanam[0]);

      const countAllUsang = await Tanam.find({ user: user }).countDocuments();

      const userData = await User.findById(user).select('_id name role');

      if (myTanam[0] == undefined) {
        res.status(404).json({
          message: 'Belum ada Lahan yang diisi',
        });
      } else {
        res.status(200).json({
          message: 'Berhasil melihat data Lahan',
          petani: userData,
          data: myTanam,
          countAllUsang: countAllUsang,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  seeATanam: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.tanamId;
      console.log(user);

      const aTanam = await Tanam.find({ user: user, _id: id });
      console.log(aTanam[0]);

      const userData = await User.findById(user).select('_id name role');

      if (aTanam[0] == undefined) {
        res.status(404).json({
          message: 'Data Lahan tidak ditemukan',
        });
      } else {
        res.status(200).json({
          message: `Berhasil melihat data Lahan dengan nama ${aTanam[0].namaLahan}`,
          petani: userData,
          data: aTanam,
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },

  changeStatus: async (req, res) => {
    try {
      const user = req.userData.id;
      const id = req.params.tanamId;
      console.log(user);

      const checkStatus = await Tanam.findOne({ _id: id, user: user });

      if (checkStatus == null) {
        res.status(404).json({
          message: 'Data lahan tidak ditemukan atau lahan bukan milikmu',
        });
      } else {
        if (checkStatus.statusLahan == statusEnum.active) {
          await Tanam.findOneAndUpdate(
            { _id: id, user: user },
            {
              statusLahan: statusEnum.finish,
            }
          );

          res.status(200).json({
            message: 'Status Lahan berhasil diubah',
            status: 'Lahan Selesai',
            statusLahan: statusEnum.finish,
          });
        } else {
          res.status(400).json({
            message: 'Status gagal diubah, Lahan sudah selesai',
          });
        }
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || `Internal server error` });
    }
  },
};
