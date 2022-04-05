module.exports = (req, res, next) => {
  let pedagang = ['pengepul', 'pengecer', 'distributor', 'agen'];
  let isPedagang = pedagang.includes(req.userData.user.role);
  if (isPedagang) {
    return next();
  } else {
    return res.status(401).json({
      message: 'Anda harus login sebagai Pedagang',
    });
  }
};
