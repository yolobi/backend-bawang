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
    let pedagang = ['pengepul', 'pengecer', 'distributor', 'agen', 'grosir'];
    let isPedagang = pedagang.includes(req.userData.role);
    if (isPedagang) {
      return next();
    } else {
      return res.status(401).json({
        message: 'Anda harus login sebagai Pedagang',
      });
    }
  },

  checkIfPetaniPedagang: (req, res, next) => {
    let user = [
      'petani',
      'pengepul',
      'pengecer',
      'distributor',
      'agen',
      'grosir',
    ];
    let isUser = user.includes(req.userData.role);
    if (isUser) {
      return next();
    } else {
      return res.status(401).json({
        message: 'Anda harus login sebagai Petani atau Pedagang',
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
