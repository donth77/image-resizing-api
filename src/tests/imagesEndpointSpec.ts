import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test images endpoint', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get('/api');
    await expect(response.status).toBe(200);
  });
  it('gets a resized image', async () => {
    const response = await request.get(
      '/api/images?filename=fjord&width=200&height=200'
    );
    await expect(response.status).toBe(200);
  });
  it('returns an error for missing query param', async () => {
    const response = await request.get('/api/images?width=200&height=200');
    await expect(response.status).toBe(400);
  });
  it('returns an error for missing file', async () => {
    const response = await request.get(
      '/api/images?filename=nonexistent&width=200&height=200'
    );
    await expect(response.status).toBe(400);
  });
});
