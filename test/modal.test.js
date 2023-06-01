const request = require('supertest');
const url = 'https://test-deploy-backend-sphsbs.df.r.appspot.com/api/v1';
const urlDev = 'http://localhost:4000/api/v1';
const petaniToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmVkOThlYTEwNTQ3NmY4M2ZlNGE2YSIsIm5hbWUiOiJ1c2VyMDEiLCJlbWFpbCI6InVzZXIwMkBtYWlsLmNvbSIsInBob25lIjoiMDgxMjAwMDAwMDAxIiwicm9sZSI6InBldGFuaSIsImlhdCI6MTY3ODI1NzA5Mn0.ztKaw4jVqC_FAvsqrxV7rQePoxHobp-XqTEWMa1YkfE';
const dinasToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWE2YzExNzhlNWRkM2I5YjY0NDkzYSIsIm5hbWUiOiJkaW1hc3BwZCIsImVtYWlsIjoiZGltYXNwcGRAbWFpbC5jb20iLCJwaG9uZSI6IjA4MTExMTIyMjMzMzQiLCJyb2xlIjoiZGluYXMiLCJpYXQiOjE2Nzk0NzUwMjN9.yhkCvMYel-Ul9lxNvcwiqxhRts39CjCsSozuEMSB3EE';
const idLahanExist = '640852808d0e459c87bd47a5';
const idLahanNotExist = '640852808d0e459c87bd47a7';
const idModalExist = '64084b128e61888496dfa4e6';
const idModalNotExist = '640852d88d0e459c87bd47ad';

describe('Tambah Modal', () => {
  test('Lahan ada', async () => {
    const data = {
      modalBenih: '1000',
      modalPupuk: '2000',
      modalPestisida: '3000',
      modalPekerja: '4000',
    };

    const res = await request(urlDev)
      .post(`/modal/addModal/${idLahanExist}`)
      .send(data)
      .set('Authorization', `Bearer ${petaniToken}`);
    expect(res.status).toBe(201);
  });

  test('Lahan tidak ada', async () => {
    const data = {
      modalBenih: '1000',
      modalPupuk: '2000',
      modalPestisida: '3000',
      modalPekerja: '4000',
    };

    const res = await request(urlDev)
      .post(`/modal/addModal/${idLahanNotExist}`)
      .send(data)
      .set('Authorization', `Bearer ${petaniToken}`);
    expect(res.status).toBe(400);
  });

  test('Bukan petani', async () => {
    const data = {
      modalBenih: '1000',
      modalPupuk: '2000',
      modalPestisida: '3000',
      modalPekerja: '4000',
    };

    const res = await request(urlDev)
      .post(`/modal/addModal/${idLahanExist}`)
      .send(data)
      .set('Authorization', `Bearer ${dinasToken}`);
    expect(res.status).toBe(401);
  });
});

describe('Get Riwayat Modal', () => {
  test('Lahan ada', async () => {
    const res = await request(urlDev)
      .get(`/modal/modal/${idLahanExist}`)
      .set('Authorization', `Bearer ${petaniToken}`);

    expect(res.status).toBe(200);
  });

  test('Lahan tidak ada', async () => {
    const res = await request(urlDev)
      .get(`/modal/modal/${idLahanNotExist}`)
      .set('Authorization', `Bearer ${petaniToken}`);

    expect(res.status).toBe(400);
  });

  test('Bukan petani', async () => {
    const res = await request(urlDev)
      .get(`/modal/modal/${idLahanExist}`)
      .set('Authorization', `Bearer ${dinasToken}`);

    expect(res.status).toBe(401);
  });
});

describe('Edit Modal', () => {
  test('Lahan ada', async () => {
    const data = {
      modalBenih: '1500',
      modalPupuk: '2500',
      modalPestisida: '3500',
      modalPekerja: '4500',
    };

    const res = await request(urlDev)
      .put(`/modal/edit/${idModalExist}`)
      .send(data)
      .set('Authorization', `Bearer ${petaniToken}`);

    expect(res.status).toBe(200);
  });

  test('Lahan tidak ada', async () => {
    const data = {
      modalBenih: '1500',
      modalPupuk: '2500',
      modalPestisida: '3500',
      modalPekerja: '4500',
    };

    const res = await request(urlDev)
      .put(`/modal/edit/${idModalNotExist}`)
      .send(data)
      .set('Authorization', `Bearer ${petaniToken}`);

    expect(res.status).toBe(400);
  });

  test('Bukan petani', async () => {
    const data = {
      modalBenih: '0',
      modalPupuk: '0',
      modalPestisida: '0',
      modalPekerja: '0',
    };

    const res = await request(urlDev)
      .put(`/modal/edit/${idModalExist}`)
      .send(data)
      .set('Authorization', `Bearer ${dinasToken}`);

    expect(res.status).toBe(401);
  });
});

describe('Delete Modal', () => {
  test('Bukan petani', async () => {
    const res = await request(urlDev)
      .delete(`/modal/delete/${idLahanExist}`)
      .set('Authorization', `Bearer ${dinasToken}`);

    expect(res.status).toBe(401);
  });

  test('Lahan ada', async () => {
    const res = await request(urlDev)
      .delete(`/modal/delete/6475c06ccd7ecb95d6a1b507`)
      .set('Authorization', `Bearer ${petaniToken}`);

    expect(res.status).toBe(200);
  });

  test('Lahan tidak ada', async () => {
    const res = await request(urlDev)
      .delete(`/modal/delete/${idLahanExist}`)
      .set('Authorization', `Bearer ${petaniToken}`);

    expect(res.status).toBe(400);
  });
});
