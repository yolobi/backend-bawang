const request = require('supertest');
const url = 'https://test-deploy-backend-sphsbs.df.r.appspot.com/api/v1';
const petaniToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmVkOThlYTEwNTQ3NmY4M2ZlNGE2YSIsIm5hbWUiOiJ1c2VyMDEiLCJlbWFpbCI6InVzZXIwMkBtYWlsLmNvbSIsInBob25lIjoiMDgxMjAwMDAwMDAxIiwicm9sZSI6InBldGFuaSIsImlhdCI6MTY3ODI1NzA5Mn0.ztKaw4jVqC_FAvsqrxV7rQePoxHobp-XqTEWMa1YkfE';
const dinasToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWE2YzExNzhlNWRkM2I5YjY0NDkzYSIsIm5hbWUiOiJkaW1hc3BwZCIsImVtYWlsIjoiZGltYXNwcGRAbWFpbC5jb20iLCJwaG9uZSI6IjA4MTExMTIyMjMzMzQiLCJyb2xlIjoiZGluYXMiLCJpYXQiOjE2Nzk0NzUwMjN9.yhkCvMYel-Ul9lxNvcwiqxhRts39CjCsSozuEMSB3EE';

describe('Export Blanko', () => {
  test('User bukan petugas pengumpul data', async () => {
    const data = {
      bulan: 'April',
      tahun: '2023',
    };

    const res = await request(url)
      .get('/blanko/export')
      .query(data)
      .set('Authorization', `Bearer ${petaniToken}`);
    expect(res.status).toBe(401);
  });

  test('User petugas pengumpul data', async () => {
    const data = {
      bulan: 'April',
      tahun: '2023',
    };

    const res = await request(url)
      .get('/blanko/export')
      .query(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(200);
  });
});
