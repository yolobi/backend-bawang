const request = require('supertest');
const url = '172.18.14.10:4000/api/v1';
const petaniToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmVkOThlYTEwNTQ3NmY4M2ZlNGE2YSIsIm5hbWUiOiJ1c2VyMDEiLCJlbWFpbCI6InVzZXIwMkBtYWlsLmNvbSIsInBob25lIjoiMDgxMjAwMDAwMDAxIiwicm9sZSI6InBldGFuaSIsImlhdCI6MTY3ODI1NzA5Mn0.ztKaw4jVqC_FAvsqrxV7rQePoxHobp-XqTEWMa1YkfE';
const dinasToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWE2YzExNzhlNWRkM2I5YjY0NDkzYSIsIm5hbWUiOiJkaW1hc3BwZCIsImVtYWlsIjoiZGltYXNwcGRAbWFpbC5jb20iLCJwaG9uZSI6IjA4MTExMTIyMjMzMzQiLCJyb2xlIjoiZGluYXMiLCJpYXQiOjE2Nzk0NzUwMjN9.yhkCvMYel-Ul9lxNvcwiqxhRts39CjCsSozuEMSB3EE';

describe('Statistik Dinas', () => {
  test('User bukan petugas dinas', async () => {
    const data = {
      jenisStatisik: 'April',
      provinsi: '2023',
      kabupaten: '123',
      kecamatan: '12',
    };

    const res = await request(url)
      .get('/dinas/')
      .query(data)
      .set('Authorization', `Bearer ${petaniToken}`);
    expect(res.status).toBe(401);
  });

  test('User petugas dinas, sampai kecamatan', async () => {
    const data = {
      jenisStatisik: 'produksi',
      provinsi: '32',
      kabupaten: '3271',
      kecamatan: '3271060',
    };

    const res = await request(url)
      .get('/dinas/')
      .query(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(200);
  });

  test('User petugas dinas, sampai kabupaten', async () => {
    const data = {
      jenisStatisik: 'produksi',
      provinsi: '32',
      kabupaten: '3271',
      //   kecamatan: '3271060',
    };

    const res = await request(url)
      .get('/dinas/')
      .query(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(200);
  });

  test('User petugas dinas, sampai provinsi', async () => {
    const data = {
      jenisStatisik: 'produksi',
      provinsi: '32',
      //   kabupaten: '3271',
      //   kecamatan: '3271060',
    };

    const res = await request(url)
      .get('/dinas/')
      .query(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(200);
  });

  test('User petugas dinas, nasional', async () => {
    const data = {
      jenisStatisik: 'produksi',
      //   provinsi: '32',
      //   kabupaten: '3271',
      //   kecamatan: '3271060',
    };

    const res = await request(url)
      .get('/dinas/')
      .query(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(200);
  });

  test('User petugas dinas, nasional, harga rata rata', async () => {
    const data = {
      jenisStatisik: 'harga',
      //   provinsi: '32',
      //   kabupaten: '3271',
      //   kecamatan: '3271060',
    };

    const res = await request(url)
      .get('/dinas/')
      .query(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(200);
  });
});
