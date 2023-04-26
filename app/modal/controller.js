const Modal = require('./model');
const User = require('../users/model');
const Lahan = require('../lahan/model');
const myFunction = require('../function/function');

module.exports = {
  addModal: async (req, res) => {
    try {
      const idUser = req.userData.id;
      const idLahan = req.params.idLahan;

      const {
        modalBenih,
        modalPupuk,
        modalPestisida,
        modalPekerja,
        jenisPupuk,
      } = req.body;
      let totalModal =
        Number(modalBenih) +
        Number(modalPupuk) +
        Number(modalPestisida) +
        Number(modalPekerja);

      const modalAwal = await Lahan.findOne({
        _id: idLahan,
        user: idUser,
      }).select('modalBenih modalPupuk modalPestisida modalPekerja totalModal');

      const updateModal = await Lahan.findOneAndUpdate(
        { _id: idLahan, user: idUser },
        {
          modalBenih: (modalAwal.modalBenih + Number(modalBenih)).toFixed(3),
          modalPupuk: (modalAwal.modalPupuk + Number(modalPupuk)).toFixed(3),
          modalPestisida: (
            modalAwal.modalPestisida + Number(modalPestisida)
          ).toFixed(3),
          modalPekerja: (modalAwal.modalPekerja + Number(modalPekerja)).toFixed(
            3
          ),
          totalModal: (modalAwal.totalModal + totalModal).toFixed(3),
        },
        { new: true }
      ).select(
        '_id modalBenih modalPupuk modalPestisida modalPekerja totalModal'
      );

      if (!updateModal) {
        res.status(400).json({
          sucess: false,
          message: 'Lahan tidak ditemukan',
        });
      } else {
        let modalBaru = new Modal({
          lahan: idLahan,
          modalBenih: Number(modalBenih).toFixed(3),
          modalPupuk: Number(modalPupuk).toFixed(3),
          modalPestisida: Number(modalPestisida).toFixed(3),
          modalPekerja: Number(modalPekerja).toFixed(3),
          jenisPupuk: jenisPupuk,
          totalModal: totalModal.toFixed(3),
        });
        await modalBaru.save();

        res.status(201).json({
          success: true,
          message: 'Berhasil menambah modal',
          data: {
            updateModal,
            modalBaru,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  getAllModal: async (req, res) => {
    try {
      const idLahan = req.params.idLahan;

      const findModal = await Modal.find({
        lahan: idLahan,
      }).sort({
        createdAt: 'descending',
      });

      if (findModal.length == 0 || !findModal) {
        res.status(404).json({
          success: false,
          message: 'Belum ada modal yang ditambahkan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Berhasil melihat data Modal',
          data: findModal,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  editModal: async (req, res) => {
    try {
      const idModal = req.params.idModal;
      const { modalBenih, modalPupuk, modalPestisida, modalPekerja } = req.body;
      let totalModal =
        Number(modalBenih) +
        Number(modalPupuk) +
        Number(modalPestisida) +
        Number(modalPekerja);

      let currentModal = await Modal.findOne({ _id: idModal });

      if (!currentModal) {
        res.status(400).json({
          success: false,
          message: 'Modal tidak ditemukan',
        });
      } else {
        let lahan = await Lahan.findOne({ _id: currentModal.lahan }).select(
          '_id modalBenih modalPupuk modalPestisida modalPekerja totalModal'
        );

        lahan.modalBenih = (lahan.modalBenih - currentModal.modalBenih).toFixed(
          3
        );
        lahan.modalPupuk = (lahan.modalPupuk - currentModal.modalPupuk).toFixed(
          3
        );
        lahan.modalPestisida = (
          lahan.modalPestisida - currentModal.modalPestisida
        ).toFixed(3);
        lahan.modalPekerja = (
          lahan.modalPekerja - currentModal.modalPekerja
        ).toFixed(3);
        lahan.totalModal = (lahan.totalModal - currentModal.totalModal).toFixed(
          3
        );

        currentModal.modalBenih = modalBenih;
        currentModal.modalPupuk = modalPupuk;
        currentModal.modalPestisida = modalPestisida;
        currentModal.modalPekerja = modalPekerja;
        currentModal.totalModal = totalModal;
        await currentModal.save();

        lahan.modalBenih = (lahan.modalBenih + currentModal.modalBenih).toFixed(
          3
        );
        lahan.modalPupuk = (lahan.modalPupuk + currentModal.modalPupuk).toFixed(
          3
        );
        lahan.modalPestisida = (
          lahan.modalPestisida + currentModal.modalPestisida
        ).toFixed(3);
        lahan.modalPekerja = (
          lahan.modalPekerja + currentModal.modalPekerja
        ).toFixed(3);
        lahan.totalModal = (lahan.totalModal + currentModal.totalModal).toFixed(
          3
        );

        await lahan.save();

        res.status(200).json({
          success: true,
          message: 'Berhasil mengupdate modal',
          data: {
            lahan,
            currentModal,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },

  deleteModal: async (req, res) => {
    try {
      const idModal = req.params.idModal;

      const findModal = await Modal.findOneAndRemove({
        _id: idModal,
      });

      if (!findModal) {
        res.status(404).json({
          success: false,
          message: 'Modal tidak ditemukan',
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Modal berhasil dihapus',
          data: findModal,
        });
      }
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: error.message || `Internal server error`,
      });
    }
  },
};
