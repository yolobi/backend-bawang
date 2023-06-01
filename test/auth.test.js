const request = require('supertest');
const bcrypt = require('bcryptjs');
const url = 'https://test-deploy-backend-sphsbs.df.r.appspot.com/api/v1';

describe('Signup User', () => {
  test('Data lengkap', async () => {
    const hashPassword = await bcrypt.hashSync('password', 10);
    const user = {
      name: 'jest8',
      email: 'testing8@jest.com',
      phone: '08123912300003',
      password: hashPassword,
      kecamatan: '7504021',
      kabupaten: '7504',
      provinsi: '75',
      alamat: 'rumah ku yang jauh',
      role: 'dinas',
    };
    const res = await request(url).post('/auth/daftar').send(user);
    expect(res.status).toBe(201);
  });

  test('User sudah ada', async () => {
    const hashPassword = await bcrypt.hashSync('password', 10);
    const user = {
      name: 'jest',
      email: 'testing3@jest.com',
      phone: '',
      password: hashPassword,
      kecamatan: '7504021',
      kabupaten: '7504',
      provinsi: '75',
      alamat: 'rumah ku yang jauh',
      role: 'dinas',
    };
    const res = await request(url).post('/auth/daftar').send(user);
    expect(res.status).toBe(404);
  });

  test('Validation Error', async () => {
    const hashPassword = await bcrypt.hashSync('password', 10);
    const user = {
      name: 'je',
      email: 'bismillah',
      phone: '08888899999000',
      password: hashPassword,
      kecamatan: '750402123123',
      kabupaten: '7504',
      provinsi: '75',
      alamat: 'rumah ku yang jauh',
      role: 'dinas',
    };
    const res = await request(url).post('/auth/daftar').send(user);
    expect(res.status).toBe(422);
  });
});

describe('Login User', () => {
  test('User ada', async () => {
    const user = {
      account: '081378273950',
      password: 'akunquintho',
    };
    const res = await request(url).post('/auth/masuk').send(user);
    expect(res.status).toBe(200);
  });

  test('User tidak ada', async () => {
    const user = {
      account: '081378273959',
      password: 'akunquintho',
    };
    const res = await request(url).post('/auth/masuk').send(user);
    expect(res.status).toBe(403);
  });

  test('Credential salah', async () => {
    const user = {
      account: '081378273950',
      password: 'akunquintho0o',
    };
    const res = await request(url).post('/auth/masuk').send(user);
    expect(res.status).toBe(403);
  });

  test('Data tidak lengkap', async () => {
    const user = {
      //   account: '081378273950',
      password: 'akunquintho0o',
    };
    const res = await request(url).post('/auth/masuk').send(user);
    expect(res.status).toBe(404);
  });
});
