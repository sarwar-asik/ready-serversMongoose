import httpStatus from 'http-status';
import request from 'supertest';
import { testDb } from '../setup/globalSetup';
import app from '../../src/app';

describe('User E2E Tests', () => {
  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  beforeEach(async () => {
    await testDb.clearDatabase();
  });

  describe('POST /api/v1/users/create', () => {
    it('should create user via API', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'string',
        contactNumber: 'string',
        role: 'user',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        address: 'Dhaka',
      };

      const response = await request(app)
        .post('/api/v1/users/create')
        .send(userData)
        .expect(httpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/v1/users/create')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
