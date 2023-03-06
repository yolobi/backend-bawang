module.exports = {
  index: async (req, res) => {
    console.log('berhasil masuk');
    res.status(200).json({
      message: 'berhasil masuk, Selamat Datang!',
    });
  },
};
