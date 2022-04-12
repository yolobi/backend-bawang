const indonesia = require('territory-indonesia');

module.exports = {
  compressInfoProvinsi: async (provinsi) => {
    let dataProvinsi = await indonesia.getProvinceById(provinsi);
    let { latitude, longitude, ...newdataProvinsi } = dataProvinsi;
    return newdataProvinsi;
  },

  compressInfoKabupaten: async (kabupaten) => {
    let dataKabupaten = await indonesia.getRegencyById(kabupaten);
    let { latitude, longitude, ...newdataKabupaten } = dataKabupaten;
    return newdataKabupaten;
  },

  compressInfoKecamatan: async (kecamatan) => {
    let dataKecamatan = await indonesia.getDistrictById(kecamatan);
    let { latitude, longitude, ...newdataKecamatan } = dataKecamatan;
    return newdataKecamatan;
  },
  teritoryInfo: async (id) => {
    if (id.toString().length === 2) {
      let dataProvinsi = await indonesia.getProvinceById(id);
      let { latitude, longitude, ...newdataProvinsi } = dataProvinsi;
      return newdataProvinsi;
    } else if (id.toString().length === 4) {
      let dataKabupaten = await indonesia.getRegencyById(id);
      let { latitude, longitude, ...newdataKabupaten } = dataKabupaten;
      return newdataKabupaten;
    } else if (id.toString().length === 7) {
      let dataKecamatan = await indonesia.getDistrictById(id);
      let { latitude, longitude, ...newdataKecamatan } = dataKecamatan;
      return newdataKecamatan;
    } else{
        return 'data tidak valid'
    }
  },
};
