import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app.js';
import Book from '../../models/Book.js';

let mongoServer;
let createdBookId;

beforeAll(async () => {
  // Create a new in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from database and stop the server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear the database after each test
  await Book.deleteMany();
  createdBookId = null;
});

describe('Book API Endpoint Tests', () => {
  // Test 1: GET /api/books - should return 200 and an array
  it('GET /api/books should return 200 and an array', async () => {
    const res = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0); // Initially empty
  });

  // Test 2: GET /api/books - should return books when they exist
  it('GET /api/books should return existing books', async () => {
    // Create test books first
    await Book.create({ title: 'Book 1', author: 'Author 1' });
    await Book.create({ title: 'Book 2', author: 'Author 2' });

    const res = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('author');
  });

  // Test 3: POST /api/books - should create a new book
  it('POST /api/books should create a new book', async () => {
    const sampleBook = {
      title: 'Test Driven Development',
      author: 'Kent Beck',
      genre: 'Programming',
      publishedYear: 2003,
      rating: 4.5
    };
    
    const res = await request(app)
      .post('/api/books')
      .send(sampleBook)
      .expect(201);
    
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(sampleBook.title);
    expect(res.body.author).toBe(sampleBook.author);
    expect(res.body.genre).toBe(sampleBook.genre);
    expect(res.body.publishedYear).toBe(sampleBook.publishedYear);
    expect(res.body.rating).toBe(sampleBook.rating);
    
    createdBookId = res.body._id;
  });

  // Test 4: POST /api/books - should create book with minimal data
  it('POST /api/books should create book with minimal required fields', async () => {
    const minimalBook = {
      title: 'Minimal Book',
      author: 'Test Author'
    };
    
    const res = await request(app)
      .post('/api/books')
      .send(minimalBook)
      .expect(201);
    
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(minimalBook.title);
    expect(res.body.author).toBe(minimalBook.author);
  });

  // Test 5: POST /api/books - should handle invalid data
  it('POST /api/books should return 400 for invalid data', async () => {
    const invalidBook = {
      title: '', // Empty title
      author: '' // Empty author
    };
    
    await request(app)
      .post('/api/books')
      .send(invalidBook)
      .expect(400);
  });

  // Test 6: PUT /api/books/:id - should update a book
  it('PUT /api/books/:id should update a book', async () => {
    // Create a book first
    const book = await Book.create({ 
      title: 'Old Title', 
      author: 'Author',
      genre: 'Fiction',
      rating: 3.0
    });
    
    const updates = { 
      title: 'New Title',
      rating: 4.5
    };
    
    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send(updates)
      .expect(200);
    
    expect(res.body.title).toBe('New Title');
    expect(res.body.rating).toBe(4.5);
    expect(res.body.author).toBe('Author'); // Should remain unchanged
  });

  // Test 7: PUT /api/books/:id - should update all fields
  it('PUT /api/books/:id should update all fields', async () => {
    // Create a book first
    const book = await Book.create({ title: 'Original', author: 'Original Author' });
    
    const completeUpdate = {
      title: 'Updated Title',
      author: 'Updated Author',
      genre: 'Updated Genre',
      publishedYear: 2024,
      rating: 5.0
    };
    
    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send(completeUpdate)
      .expect(200);
    
    expect(res.body.title).toBe(completeUpdate.title);
    expect(res.body.author).toBe(completeUpdate.author);
    expect(res.body.genre).toBe(completeUpdate.genre);
    expect(res.body.publishedYear).toBe(completeUpdate.publishedYear);
    expect(res.body.rating).toBe(completeUpdate.rating);
  });

  // Test 8: PUT /api/books/:id - should handle non-existent book
  it('PUT /api/books/:id should handle non-existent book', async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const updates = { title: 'Updated Title' };
  
  await request(app)
    .put(`/api/books/${nonExistentId}`)
    .send(updates)
    .expect(404); // Changed from 400 to 404
});

  // Test 9: PUT /api/books/:id - should handle invalid ID format
  it('PUT /api/books/:id should handle invalid ID format', async () => {
    const invalidId = 'invalid-id-format';
    const updates = { title: 'Updated Title' };
    
    await request(app)
      .put(`/api/books/${invalidId}`)
      .send(updates)
      .expect(400);
  });

  // Test 10: DELETE /api/books/:id - should delete a book
  it('DELETE /api/books/:id should delete a book', async () => {
    // Create a book first
    const book = await Book.create({ title: 'To Delete', author: 'Author' });
    
    const deleteRes = await request(app)
      .delete(`/api/books/${book._id}`)
      .expect(200);
    
    expect(deleteRes.body.message).toBe('Book deleted successfully');
    
    // Verify the book is actually deleted
    const getRes = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(getRes.body.length).toBe(0);
  });

  // Test 11: DELETE /api/books/:id - should handle non-existent book
  it('DELETE /api/books/:id should handle non-existent book', async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  
  await request(app)
    .delete(`/api/books/${nonExistentId}`)
    .expect(404); // Changed from 500 to 404
});

  // Test 12: DELETE /api/books/:id - should handle invalid ID format
  it('DELETE /api/books/:id should handle invalid ID format', async () => {
  const invalidId = 'invalid-id-format';
  
  await request(app)
    .delete(`/api/books/${invalidId}`)
    .expect(400); // Changed from 500 to 400
});
  // Test 13: Complete CRUD workflow
  it('should perform complete CRUD workflow', async () => {
    // CREATE
    const newBook = {
      title: 'CRUD Test Book',
      author: 'CRUD Author',
      genre: 'Testing',
      publishedYear: 2024,
      rating: 4.0
    };
    
    const createRes = await request(app)
      .post('/api/books')
      .send(newBook)
      .expect(201);
    
    const bookId = createRes.body._id;
    expect(createRes.body.title).toBe(newBook.title);
    
    // READ
    const readRes = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(readRes.body.length).toBe(1);
    expect(readRes.body[0]._id).toBe(bookId);
    
    // UPDATE
    const updates = { title: 'Updated CRUD Book', rating: 4.8 };
    const updateRes = await request(app)
      .put(`/api/books/${bookId}`)
      .send(updates)
      .expect(200);
    
    expect(updateRes.body.title).toBe('Updated CRUD Book');
    expect(updateRes.body.rating).toBe(4.8);
    
    // DELETE
    await request(app)
      .delete(`/api/books/${bookId}`)
      .expect(200);
    
    // Verify deletion
    const finalRes = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(finalRes.body.length).toBe(0);
  });

  // Test 14: Test with special characters and edge cases
  it('should handle special characters in book data', async () => {
    const specialBook = {
      title: 'Book with Special Characters: @#$%^&*()',
      author: 'Author with Émojis 📚',
      genre: 'Fiction & Fantasy',
      publishedYear: 2024,
      rating: 4.2
    };
    
    const res = await request(app)
      .post('/api/books')
      .send(specialBook)
      .expect(201);
    
    expect(res.body.title).toBe(specialBook.title);
    expect(res.body.author).toBe(specialBook.author);
    expect(res.body.genre).toBe(specialBook.genre);
  });

  // Test 15: Test boundary values for rating
  it('should handle boundary values for rating', async () => {
    const bookWithMinRating = {
      title: 'Min Rating Book',
      author: 'Test Author',
      rating: 1.0
    };
    
    const res1 = await request(app)
      .post('/api/books')
      .send(bookWithMinRating)
      .expect(201);
    
    expect(res1.body.rating).toBe(1.0);
    
    // Clear for next test
    await Book.deleteMany();
    
    const bookWithMaxRating = {
      title: 'Max Rating Book',
      author: 'Test Author',
      rating: 5.0
    };
    
    const res2 = await request(app)
      .post('/api/books')
      .send(bookWithMaxRating)
      .expect(201);
    
    expect(res2.body.rating).toBe(5.0);
  });
});
