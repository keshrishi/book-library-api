import React, { useState } from 'react';

const AddBook = ({ onAddBook }) => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: '',
    rating: ''
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBook(book);
    setBook({
      title: '',
      author: '',
      genre: '',
      publishedYear: '',
      rating: ''
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-1">Add New Book</h2>
      <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mb-6"></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Author <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={book.publishedYear}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              value={book.rating}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
