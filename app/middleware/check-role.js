module.exports = {
  checkIfAdmin: (req, res, next) => {
    if (req.userData.role == 'admin') {
      return next();
    } else {
      return res.status(401).json({
        message: 'Anda harus login sebagai Petani',
      });
    }
  },

  checkIfPetani: (req, res, next) => {
    if (req.userData.role == 'petani') {
      return next();
    } else {
      return res.status(401).json({
        message: 'Anda harus login sebagai Petani',
      });
    }
  },

  checkIfPedagang: (req, res, next) => {
    let pedagang = ['pengepul', 'pengecer', 'distributor', 'agen'];
    let isPedagang = pedagang.includes(req.userData.role);
    if (isPedagang) {
      return next();
    } else {
      return res.status(401).json({
        message: 'Anda harus login sebagai Pedagang',
      });
    }
  },

  checkIfDinas: (req, res, next) => {
    let dinasPertanian = [
      'pdh',
      'dinasPertanianKota',
      'dinasPertanianProvinsi',
    ];
    let isDinasPertanian = dinasPertanian.includes(req.userData.role);
    if (isDinasPertanian) {
      return next();
    } else {
      return res.status(401).json({
        message: 'Anda harus login sebagai Dinas Pertanian',
      });
    }
  },
};
