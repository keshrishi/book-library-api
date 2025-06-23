import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// Use dynamic imports and ESM mocking
let bookController, Book;

beforeAll(async () => {
  // Mock the Book model using Jest's ESM mocking
  await jest.unstable_mockModule('../../models/Book.js', () => ({
    default: jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn(),
    }))
  }));

  // Import modules after mocking
  bookController = await import('../../controllers/bookController.js');
  const BookModule = await import('../../models/Book.js');
  Book = BookModule.default;
  
  // Add static methods to the mock
  Book.find = jest.fn();
  Book.findByIdAndUpdate = jest.fn();
  Book.findByIdAndDelete = jest.fn();
});

describe('Book Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to create proper mock response object
  const createMockRes = () => {
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };
    res.status.mockReturnValue(res);
    return res;
  };

  // Test 1: Get all books successfully
  it('should get all books', async () => {
    const mockBooks = [
      { 
        _id: '64d2a2fc9a6d5b1d843f33a1',
        title: 'The Go Programming Language', 
        author: 'Alan A. A. Donovan',
        genre: 'Programming',
        publishedYear: 2015,
        rating: 4.7
      },
      { 
        _id: '64d2a2fc9a6d5b1d843f33a2',
        title: 'Go in Action', 
        author: 'William Kennedy',
        genre: 'Programming',
        publishedYear: 2016,
        rating: 4.5
      }
    ];
    
    Book.find.mockResolvedValue(mockBooks);

    const req = {};
    const res = { json: jest.fn() };

    await bookController.getBooks(req, res);

    expect(Book.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  // Test 2: Handle get books error
  it('should handle get books error', async () => {
    const errorMessage = 'Database connection failed';
    Book.find.mockRejectedValue(new Error(errorMessage));

    const req = {};
    const res = createMockRes();

    await bookController.getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  // Test 3: Create a new book successfully
  it('should create a new book', async () => {
    const mockBookData = { 
      title: 'Concurrency in Go', 
      author: 'Katherine Cox-Buday',
      genre: 'Programming',
      publishedYear: 2017,
      rating: 4.6
    };
    
    const savedBook = { 
      _id: '64d2a2fc9a6d5b1d843f33a3',
      ...mockBookData 
    };

    // Create a mock instance with save method
    const mockBookInstance = {
      ...mockBookData,
      save: jest.fn().mockResolvedValue(savedBook)
    };

    Book.mockImplementation(() => mockBookInstance);

    const req = { body: mockBookData };
    const res = createMockRes();

    await bookController.createBook(req, res);

    expect(Book).toHaveBeenCalledWith(mockBookData);
    expect(mockBookInstance.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedBook);
  });

  // Test 4: Handle create book error
  it('should handle create book error', async () => {
    const mockBookData = { title: 'Invalid Book' };
    const errorMessage = 'Validation failed';

    const mockBookInstance = {
      save: jest.fn().mockRejectedValue(new Error(errorMessage))
    };

    Book.mockImplementation(() => mockBookInstance);

    const req = { body: mockBookData };
    const res = createMockRes();

    await bookController.createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  // Test 5: Update a book successfully
  it('should update a book', async () => {
    const bookId = '64d2a2fc9a6d5b1d843f33a1';
    const updates = { 
      title: 'Go Web Programming - Updated Edition',
      rating: 4.9 
    };
    const updatedBook = { 
      _id: bookId,
      title: 'Go Web Programming - Updated Edition',
      author: 'Sau Sheong Chang',
      genre: 'Programming',
      publishedYear: 2016,
      rating: 4.9
    };
    
    // Mock mongoose.Types.ObjectId.isValid to return true
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
    Book.findByIdAndUpdate.mockResolvedValue(updatedBook);

    const req = { 
      params: { id: bookId }, 
      body: updates 
    };
    const res = { json: jest.fn() };

    await bookController.updateBook(req, res);

    expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
      bookId, 
      updates, 
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith(updatedBook);

    mongoose.Types.ObjectId.isValid.mockRestore();
  });

  // Test 6: Handle update book with invalid ID format
  it('should handle update book with invalid ID format', async () => {
    const bookId = 'invalid-id';
    const updates = { title: 'Updated Title' };

    // Mock mongoose.Types.ObjectId.isValid to return false for invalid ID
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);

    const req = { 
      params: { id: bookId }, 
      body: updates 
    };
    const res = createMockRes();

    await bookController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID format' });

    mongoose.Types.ObjectId.isValid.mockRestore();
  });

  // Test 7: Handle update book not found
  it('should handle update book not found', async () => {
    const bookId = '64d2a2fc9a6d5b1d843f33a1';
    const updates = { title: 'Updated Title' };

    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
    Book.findByIdAndUpdate.mockResolvedValue(null); // Book not found

    const req = { 
      params: { id: bookId }, 
      body: updates 
    };
    const res = createMockRes();

    await bookController.updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });

    mongoose.Types.ObjectId.isValid.mockRestore();
  });

  // Test 8: Delete a book successfully
  it('should delete a book', async () => {
    const bookId = '64d2a2fc9a6d5b1d843f33a1';
    
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
    Book.findByIdAndDelete.mockResolvedValue({ _id: bookId });

    const req = { params: { id: bookId } };
    const res = { json: jest.fn() };

    await bookController.deleteBook(req, res);

    expect(Book.findByIdAndDelete).toHaveBeenCalledWith(bookId);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Book deleted successfully' 
    });

    mongoose.Types.ObjectId.isValid.mockRestore();
  });

  // Test 9: Handle delete book with invalid ID format
  it('should handle delete book with invalid ID format', async () => {
    const bookId = 'invalid-id';

    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);

    const req = { params: { id: bookId } };
    const res = createMockRes();

    await bookController.deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book ID format' });

    mongoose.Types.ObjectId.isValid.mockRestore();
  });

  // Test 10: Handle delete book not found
  it('should handle delete book not found', async () => {
    const bookId = '64d2a2fc9a6d5b1d843f33a1';

    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
    Book.findByIdAndDelete.mockResolvedValue(null); // Book not found

    const req = { params: { id: bookId } };
    const res = createMockRes();

    await bookController.deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });

    mongoose.Types.ObjectId.isValid.mockRestore();
  });

  // Test 11: Test with empty database
  it('should return empty array when no books exist', async () => {
    Book.find.mockResolvedValue([]);

    const req = {};
    const res = { json: jest.fn() };

    await bookController.getBooks(req, res);

    expect(Book.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
