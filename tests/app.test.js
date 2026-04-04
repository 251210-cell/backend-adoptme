const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(404);
  });
});