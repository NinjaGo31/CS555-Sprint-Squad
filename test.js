import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from './app.js';
import dotenv from 'dotenv'
import request from 'supertest';

dotenv.config({path:'./config.env'})
// Database setup for User details
describe('Test Database Connection and Server', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_LOCAL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should check if the database is connected', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 indicates connected
  });

  it('should check if the server is active', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
