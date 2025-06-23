import Book from '../models/Book.js';
import mongoose from 'mongoose';

// GET all books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new book
export const createBook = async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publishedYear: req.body.publishedYear,
    rating: req.body.rating
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(updatedBook);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    res.status(400).json({ message: error.message });
  }
};

// DELETE book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};
