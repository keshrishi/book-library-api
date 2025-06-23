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

describe('Book API Integration Tests', () => {
  it('should create and retrieve a book', async () => {
    const bookData = { title: 'Go Web Programming', author: 'Sau Sheong Chang', genre: 'Programming', publishedYear: 2016, rating: 4.5 };
    const createResponse = await request(app).post('/api/books').send(bookData).expect(201);
    expect(createResponse.body.title).toBe(bookData.title);
    expect(createResponse.body.author).toBe(bookData.author);
    expect(createResponse.body).toHaveProperty('_id');
    const getResponse = await request(app).get('/api/books').expect(200);
    expect(getResponse.body.length).toBe(1);
    expect(getResponse.body[0].title).toBe(bookData.title);
    expect(getResponse.body[0].author).toBe(bookData.author);
  });

  it('should return empty array when no books exist', async () => {
    const response = await request(app).get('/api/books').expect(200);
    expect(response.body).toEqual([]);
    expect(response.body.length).toBe(0);
  });

  it('should create book with only required fields', async () => {
    const minimalBook = { title: 'Minimal Book', author: 'Test Author' };
    const response = await request(app).post('/api/books').send(minimalBook).expect(201);
    expect(response.body.title).toBe(minimalBook.title);
    expect(response.body.author).toBe(minimalBook.author);
    expect(response.body).toHaveProperty('_id');
  });

  it('should create book with all fields', async () => {
    const fullBook = { title: 'The Go Programming Language', author: 'Alan A. A. Donovan', genre: 'Programming', publishedYear: 2015, rating: 4.7 };
    const response = await request(app).post('/api/books').send(fullBook).expect(201);
    expect(response.body.title).toBe(fullBook.title);
    expect(response.body.author).toBe(fullBook.author);
    expect(response.body.genre).toBe(fullBook.genre);
    expect(response.body.publishedYear).toBe(fullBook.publishedYear);
    expect(response.body.rating).toBe(fullBook.rating);
  });

  it('should update a book', async () => {
    const originalBook = { title: 'Original Title', author: 'Original Author', rating: 3.5 };
    const book = await Book.create(originalBook);
    const updates = { title: 'Updated Title', rating: 4.8 };
    const response = await request(app).put(`/api/books/${book._id}`).send(updates).expect(200);
    expect(response.body.title).toBe('Updated Title');
    expect(response.body.rating).toBe(4.8);
    expect(response.body.author).toBe('Original Author');
  });

  it('should handle update with invalid book ID', async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const updates = { title: 'Updated Title' };
    await request(app).put(`/api/books/${invalidId}`).send(updates).expect(404);
  });

  it('should delete a book', async () => {
    const bookData = { title: 'To Delete', author: 'Test Author' };
    const book = await Book.create(bookData);
    const deleteResponse = await request(app).delete(`/api/books/${book._id}`).expect(200);
    expect(deleteResponse.body.message).toBe('Book deleted successfully');
    const getResponse = await request(app).get('/api/books').expect(200);
    expect(getResponse.body.length).toBe(0);
  });

  it('should handle delete with invalid book ID', async () => {
    const invalidId = new mongoose.Types.ObjectId();
    await request(app).delete(`/api/books/${invalidId}`).expect(404);
  });

  it('should handle invalid request body for book creation', async () => {
    const invalidBook = { title: '' };
    await request(app).post('/api/books').send(invalidBook).expect(400);
  });
});
