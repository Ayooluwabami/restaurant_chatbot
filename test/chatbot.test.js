const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('../routes/routes');
const connectDB = require('../config/db');
const app = express();

app.use(express.json());
app.use('/api', routes);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Chatbot API', () => {
  test('GET /api/start should return welcome message and options', async () => {
    const res = await request(app).get('/api/start');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toContain('Welcome');
    expect(res.body.message).toContain('Select 1');
    expect(res.body.message).toContain('Select 99');
    expect(res.body.message).toContain('Select 98');
    expect(res.body.message).toContain('Select 97');
    expect(res.body.message).toContain('Select 0');
  });

  test('POST /api/message should process user messages', async () => {
    const message = { message: 'Hello, I would like to place an order' };
    const res = await request(app).post('/api/message').send(message);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  test('GET /api/menu should fetch menu items', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('menuItems');
    expect(Array.isArray(res.body.menuItems)).toBe(true);
  });

  test('POST /api/order should place an order', async () => {
    const order = { items: ['Pizza', 'Salad'] };
    const res = await request(app).post('/api/order').send(order);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('order');
    expect(res.body.order.items).toEqual(order.items);
  });

  test('GET /api/orders should fetch placed orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('orders');
    expect(Array.isArray(res.body.orders)).toBe(true);
  });

  test('GET /api/order/current should fetch current order', async () => {
    const res = await request(app).get('/api/order/current');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('currentOrder');
  });

  test('POST /api/order/cancel should cancel current order', async () => {
    const res = await request(app).post('/api/order/cancel');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});
