module.exports = {
  index: async (req, res) => {
      console.log(req.userData)
      res.status(200).json({
          message: 'berhasil masuk'
      })
  },
};
