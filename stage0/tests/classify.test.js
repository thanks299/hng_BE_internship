import request from 'supertest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import app from '../src/app.js';

const mock = new MockAdapter(axios);
const GENDERIZE_URL = process.env.GENDERIZE_URL;

afterEach(() => mock.reset());
afterAll(() => mock.restore());

const validPayload = {
  count: 200,
  name: 'james',
  gender: 'male',
  probability: 0.95,
};

describe('GET /api/classify', () => {
  // ── Happy path ────────────────────────────────────────────────────────────
  test('200 – correct structure for a confident prediction', async () => {
    mock.onGet(GENDERIZE_URL).reply(200, validPayload);

    const res = await request(app).get('/api/classify?name=james');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');

    const { data } = res.body;
    expect(data.name).toBe('james');
    expect(data.gender).toBe('male');
    expect(data.probability).toBe(0.95);
    expect(data.sample_size).toBe(200);
    expect(data.is_confident).toBe(true);
    expect(data.processed_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(data).not.toHaveProperty('count');
  });

  test('200 – is_confident false when probability < 0.7', async () => {
    mock.onGet(GENDERIZE_URL).reply(200, { ...validPayload, probability: 0.6 });
    const res = await request(app).get('/api/classify?name=james');
    expect(res.body.data.is_confident).toBe(false);
  });

  test('200 – is_confident false when sample_size < 100', async () => {
    mock.onGet(GENDERIZE_URL).reply(200, { ...validPayload, count: 50 });
    const res = await request(app).get('/api/classify?name=james');
    expect(res.body.data.is_confident).toBe(false);
  });

  // ── Validation ────────────────────────────────────────────────────────────
  test('400 – missing name parameter', async () => {
    const res = await request(app).get('/api/classify');
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ status: 'error', message: expect.stringContaining('"name"') });
  });

  test('400 – empty name parameter', async () => {
    const res = await request(app).get('/api/classify?name=');
    expect(res.status).toBe(400);
  });

  test('422 – duplicate name keys (array)', async () => {
    const res = await request(app).get('/api/classify?name=james&name=anna');
    expect(res.status).toBe(422);
    expect(res.body.status).toBe('error');
  });

  // ── Upstream / data errors ────────────────────────────────────────────────
  test('404 – gender is null from Genderize', async () => {
    mock.onGet(GENDERIZE_URL).reply(200, { count: 0, name: 'xyzzy', gender: null, probability: null });
    const res = await request(app).get('/api/classify?name=xyzzy');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('No prediction available');
  });

  test('502 – Genderize returns 5xx', async () => {
    mock.onGet(GENDERIZE_URL).reply(503, { error: 'Service Unavailable' });
    const res = await request(app).get('/api/classify?name=james');
    expect(res.status).toBe(502);
    expect(res.body.status).toBe('error');
  });

  test('504 – Genderize times out', async () => {
    mock.onGet(GENDERIZE_URL).timeout();
    const res = await request(app).get('/api/classify?name=james');
    expect(res.status).toBe(504);
    expect(res.body.status).toBe('error');
  });

  // ── Infrastructure ────────────────────────────────────────────────────────
  test('CORS header present on all responses', async () => {
    mock.onGet(GENDERIZE_URL).reply(200, validPayload);
    const res = await request(app).get('/api/classify?name=james');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  test('CORS header present on error responses', async () => {
    const res = await request(app).get('/api/classify');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  test('404 – unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
