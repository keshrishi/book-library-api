import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app.js';
import Book from '../../models/Book.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Book.deleteMany();
});

describe('Book API Endpoint Tests', () => {
  it('GET /api/books should return 200 and an array', async () => {
    const res = await request(app).get('/api/books').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /api/books should create a new book', async () => {
    const sampleBook = {
      title: 'Test Driven Development',
      author: 'Kent Beck',
      genre: 'Programming',
      publishedYear: 2003,
      rating: 4.5
    };
    const res = await request(app).post('/api/books').send(sampleBook).expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(sampleBook.title);
  });

  it('POST /api/books should create book with minimal required fields', async () => {
    const minimalBook = { title: 'Minimal Book', author: 'Test Author' };
    const res = await request(app).post('/api/books').send(minimalBook).expect(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(minimalBook.title);
  });

  it('POST /api/books should return 400 for invalid data', async () => {
    const invalidBook = { title: '', author: '' };
    await request(app).post('/api/books').send(invalidBook).expect(400);
  });

  it('PUT /api/books/:id should update a book', async () => {
    const book = await Book.create({ title: 'Old Title', author: 'Author' });
    const updates = { title: 'New Title', rating: 4.5 };
    const res = await request(app).put(`/api/books/${book._id}`).send(updates).expect(200);
    expect(res.body.title).toBe('New Title');
  });

  it('PUT /api/books/:id should handle non-existent book', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updates = { title: 'Updated Title' };
    await request(app).put(`/api/books/${nonExistentId}`).send(updates).expect(404);
  });

  it('PUT /api/books/:id should handle invalid ID format', async () => {
    const invalidId = 'invalid-id-format';
    const updates = { title: 'Updated Title' };
    await request(app).put(`/api/books/${invalidId}`).send(updates).expect(400);
  });

  it('DELETE /api/books/:id should delete a book', async () => {
    const book = await Book.create({ title: 'To Delete', author: 'Author' });
    await request(app).delete(`/api/books/${book._id}`).expect(200);
    const res = await request(app).get('/api/books').expect(200);
    expect(res.body.length).toBe(0);
  });

  it('DELETE /api/books/:id should handle non-existent book', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await request(app).delete(`/api/books/${nonExistentId}`).expect(404);
  });

  it('DELETE /api/books/:id should handle invalid ID format', async () => {
    const invalidId = 'invalid-id-format';
    await request(app).delete(`/api/books/${invalidId}`).expect(400);
  });
});
