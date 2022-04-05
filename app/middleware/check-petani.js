module.exports = (req, res, next) => {
  if (req.userData.user.role == 'petani') {
    return next();
  } else {
    return res.status(401).json({
      message: 'Anda harus login sebagai Petani',
    });
  }
};
