const request = require('supertest');
const url = 'https://test-deploy-backend-sphsbs.df.r.appspot.com/api/v1';
const petaniToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmVkOThlYTEwNTQ3NmY4M2ZlNGE2YSIsIm5hbWUiOiJ1c2VyMDEiLCJlbWFpbCI6InVzZXIwMkBtYWlsLmNvbSIsInBob25lIjoiMDgxMjAwMDAwMDAxIiwicm9sZSI6InBldGFuaSIsImlhdCI6MTY3ODI1NzA5Mn0.ztKaw4jVqC_FAvsqrxV7rQePoxHobp-XqTEWMa1YkfE';
const dinasToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWE2YzExNzhlNWRkM2I5YjY0NDkzYSIsIm5hbWUiOiJkaW1hc3BwZCIsImVtYWlsIjoiZGltYXNwcGRAbWFpbC5jb20iLCJwaG9uZSI6IjA4MTExMTIyMjMzMzQiLCJyb2xlIjoiZGluYXMiLCJpYXQiOjE2Nzk0NzUwMjN9.yhkCvMYel-Ul9lxNvcwiqxhRts39CjCsSozuEMSB3EE';

describe('Tambah Lahan', () => {
  test('Data lengkap', async () => {
    const data = {
      komoditas: 'bawangMerah',
      namaLahan: 'lahan 1',
      tanggalTanam: '2023-03-10',
      jumlahBatang: '100',
      luasLahan: '50',
      modalBenih: '50000',
      modalPupuk: '100000',
      modalPestisida: '200000',
      modalPekerja: '500000',
      jenisPupuk: 'za',
    };

    const res = await request(url)
      .post('/lahan/tambah')
      .send(data)
      .set('Authorization', `Bearer ${petaniToken}`);
    expect(res.status).toBe(201);
  });

  test('Data Salah', async () => {
    const data = {
      komoditas: 'bawangHijau',
      namaLahan: 'lahan 1',
      tanggalTanam: '2023-03-10',
      jumlahBatang: '100',
      luasLahan: '50',
      modalBenih: '50000',
      modalPupuk: '100000',
      modalPestisida: '200000',
      modalPekerja: '500000',
      jenisPupuk: 'za',
    };

    const res = await request(url)
      .post('/lahan/tambah')
      .send(data)
      .set('Authorization', `Bearer ${petaniToken}`);
    expect(res.status).toBe(500);
  });

  test('Forbidden', async () => {
    const data = {
      komoditas: 'bawangMerah',
      namaLahan: 'lahan 1',
      tanggalTanam: '2023-03-10',
      jumlahBatang: '100',
      luasLahan: '50',
      modalBenih: '50000',
      modalPupuk: '100000',
      modalPestisida: '200000',
      modalPekerja: '500000',
      jenisPupuk: 'za',
    };

    const res = await request(url)
      .post('/lahan/tambah')
      .send(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(401);
  });
});

describe('Get All Lahan', () => {});

describe('Get Lahan By Id', () => {});

describe('Edit Luas Lahan Rusak', () => {});

describe('Lahan Selesai', () => {});

describe('Aktifkan Lahan', () => {});

describe('Hapus Lahan', () => {});
