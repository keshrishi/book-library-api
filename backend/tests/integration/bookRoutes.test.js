import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app.js';
import Book from '../../models/Book.js';

let mongoServer;

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
});

describe('Book API Integration Tests', () => {
  // Test 1: Create and retrieve a book
  it('should create and retrieve a book', async () => {
    const bookData = { 
      title: 'Go Web Programming', 
      author: 'Sau Sheong Chang',
      genre: 'Programming',
      publishedYear: 2016,
      rating: 4.5
    };
    
    // Create book
    const createResponse = await request(app)
      .post('/api/books')
      .send(bookData)
      .expect(201);
    
    expect(createResponse.body.title).toBe(bookData.title);
    expect(createResponse.body.author).toBe(bookData.author);
    expect(createResponse.body).toHaveProperty('_id');
    
    // Retrieve all books
    const getResponse = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(getResponse.body.length).toBe(1);
    expect(getResponse.body[0].title).toBe(bookData.title);
    expect(getResponse.body[0].author).toBe(bookData.author);
  });

  // Test 2: Get all books when database is empty
  it('should return empty array when no books exist', async () => {
    const response = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(response.body).toEqual([]);
    expect(response.body.length).toBe(0);
  });

  // Test 3: Create book with minimal data
  it('should create book with only required fields', async () => {
    const minimalBook = { 
      title: 'Minimal Book', 
      author: 'Test Author' 
    };
    
    const response = await request(app)
      .post('/api/books')
      .send(minimalBook)
      .expect(201);
    
    expect(response.body.title).toBe(minimalBook.title);
    expect(response.body.author).toBe(minimalBook.author);
    expect(response.body).toHaveProperty('_id');
  });

  // Test 4: Create book with all fields
  it('should create book with all fields', async () => {
    const fullBook = {
      title: 'The Go Programming Language',
      author: 'Alan A. A. Donovan',
      genre: 'Programming',
      publishedYear: 2015,
      rating: 4.7
    };
    
    const response = await request(app)
      .post('/api/books')
      .send(fullBook)
      .expect(201);
    
    expect(response.body.title).toBe(fullBook.title);
    expect(response.body.author).toBe(fullBook.author);
    expect(response.body.genre).toBe(fullBook.genre);
    expect(response.body.publishedYear).toBe(fullBook.publishedYear);
    expect(response.body.rating).toBe(fullBook.rating);
  });

  // Test 5: Update a book
  it('should update a book', async () => {
    // First create a book
    const originalBook = { 
      title: 'Original Title', 
      author: 'Original Author',
      rating: 3.5
    };
    const book = await Book.create(originalBook);
    
    // Update the book
    const updates = { 
      title: 'Updated Title',
      rating: 4.8 
    };
    const response = await request(app)
      .put(`/api/books/${book._id}`)
      .send(updates)
      .expect(200);
    
    expect(response.body.title).toBe('Updated Title');
    expect(response.body.rating).toBe(4.8);
    expect(response.body.author).toBe('Original Author'); // Should remain unchanged
  });

  // Test 6: Update book with invalid ID
  it('should handle update with invalid book ID', async () => {
  const invalidId = new mongoose.Types.ObjectId();
  const updates = { title: 'Updated Title' };
  
  await request(app)
    .put(`/api/books/${invalidId}`)
    .send(updates)
    .expect(404); // Changed from 400 to 404
});


  // Test 7: Delete a book
  it('should delete a book', async () => {
    // Create a book
    const bookData = { title: 'To Delete', author: 'Test Author' };
    const book = await Book.create(bookData);
    
    // Delete the book
    const deleteResponse = await request(app)
      .delete(`/api/books/${book._id}`)
      .expect(200);
    
    expect(deleteResponse.body.message).toBe('Book deleted successfully');
    
    // Verify deletion by checking if book list is empty
    const getResponse = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(getResponse.body.length).toBe(0);
  });

  // Test 8: Delete book with invalid ID
  it('should handle delete with invalid book ID', async () => {
  const invalidId = new mongoose.Types.ObjectId();
  
  await request(app)
    .delete(`/api/books/${invalidId}`)
    .expect(404); // Changed from 500 to 404
});

  // Test 9: Create multiple books and retrieve them
  it('should create multiple books and retrieve them all', async () => {
    const books = [
      { title: 'Book 1', author: 'Author 1' },
      { title: 'Book 2', author: 'Author 2' },
      { title: 'Book 3', author: 'Author 3' }
    ];
    
    // Create all books
    for (const book of books) {
      await request(app)
        .post('/api/books')
        .send(book)
        .expect(201);
    }
    
    // Retrieve all books
    const response = await request(app)
      .get('/api/books')
      .expect(200);
    
    expect(response.body.length).toBe(3);
    expect(response.body.map(book => book.title)).toEqual(
      expect.arrayContaining(['Book 1', 'Book 2', 'Book 3'])
    );
  });

  // Test 10: Update multiple fields at once
  it('should update multiple fields at once', async () => {
    // Create book
    const originalBook = { 
      title: 'Original', 
      author: 'Original Author',
      genre: 'Fiction',
      rating: 3.0
    };
    const book = await Book.create(originalBook);
    
    // Update multiple fields
    const updates = {
      title: 'Completely Updated',
      author: 'New Author',
      genre: 'Non-Fiction',
      rating: 4.5
    };
    
    const response = await request(app)
      .put(`/api/books/${book._id}`)
      .send(updates)
      .expect(200);
    
    expect(response.body.title).toBe('Completely Updated');
    expect(response.body.author).toBe('New Author');
    expect(response.body.genre).toBe('Non-Fiction');
    expect(response.body.rating).toBe(4.5);
  });

  // Test 11: Handle invalid request body for creation
  it('should handle invalid request body for book creation', async () => {
    const invalidBook = { title: '' }; // Missing author, empty title
    
    await request(app)
      .post('/api/books')
      .send(invalidBook)
      .expect(400);
  });

  // Test 12: Verify book persistence across requests
  it('should persist book data across multiple requests', async () => {
    const bookData = { 
      title: 'Persistent Book', 
      author: 'Persistent Author',
      rating: 4.2
    };
    
    // Create book
    const createResponse = await request(app)
      .post('/api/books')
      .send(bookData)
      .expect(201);
    
    const bookId = createResponse.body._id;
    
    // Retrieve the specific book multiple times
    for (let i = 0; i < 3; i++) {
      const getResponse = await request(app)
        .get('/api/books')
        .expect(200);
      
      expect(getResponse.body.length).toBe(1);
      expect(getResponse.body[0]._id).toBe(bookId);
      expect(getResponse.body[0].title).toBe(bookData.title);
    }
  });

  // Test 13: Test with special characters in book data
  it('should handle special characters in book data', async () => {
    const specialBook = {
      title: 'Special Characters: @#$%^&*()',
      author: 'Author with Émojis 📚',
      genre: 'Fiction & Fantasy'
    };
    
    const response = await request(app)
      .post('/api/books')
      .send(specialBook)
      .expect(201);
    
    expect(response.body.title).toBe(specialBook.title);
    expect(response.body.author).toBe(specialBook.author);
    expect(response.body.genre).toBe(specialBook.genre);
  });
});
