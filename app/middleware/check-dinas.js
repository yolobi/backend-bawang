module.exports = (req, res, next) => {
  let dinasPertanian = ['pdh', 'dinasPertanianKota', 'dinasPertanianProvinsi'];
  let isDinasPertanian = dinasPertanian.includes(req.userData.user.role);
  if (isDinasPertanian) {
    return next();
  } else {
    return res.status(401).json({
      message: 'Anda harus login sebagai Dinas Pertanian',
    });
  }
};
