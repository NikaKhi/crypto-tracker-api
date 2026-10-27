import request from 'supertest';
import app from '../server';
import { initDatabase } from '../database/init';
import db from '../database/db';
import { stopScheduler } from '../tasks/price-scheduler';

const API_KEY = 'my_super_secret_token_123';

beforeAll(() => {
  initDatabase();
  db.exec('DELETE FROM price_history; DELETE FROM cryptocurrencies;');
});

afterAll(() => {
  stopScheduler();
  db.exec('DELETE FROM price_history; DELETE FROM cryptocurrencies;');
  db.close();
});

describe('API Tests', () => {
  describe('GET /status', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/status');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/cryptos', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/cryptos').send({ symbol: 'BTC', name: 'Bitcoin' });
      expect(res.status).toBe(401);
    });

    it('should create a new crypto with valid token', async () => {
      const res = await request(app)
        .post('/api/cryptos')
        .set('Authorization', `Bearer ${API_KEY}`)
        .send({ symbol: 'BTC', name: 'Bitcoin' });
      
      expect(res.status).toBe(201);
      expect(res.body.symbol).toBe('BTC');
    });

    it('should return 400 if symbol or name is missing', async () => {
      const res = await request(app)
        .post('/api/cryptos')
        .set('Authorization', `Bearer ${API_KEY}`)
        .send({ symbol: 'BTC' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/cryptos/:id/history', () => {
    it('should return 404 for non-existent crypto', async () => {
      const res = await request(app)
        .get('/api/cryptos/999/history')
        .set('Authorization', `Bearer ${API_KEY}`);
      
      expect(res.status).toBe(404);
    });
  });
});