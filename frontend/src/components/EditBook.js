import React, { useState, useEffect } from 'react';

const EditBook = ({ book, onUpdateBook, onCancel }) => {
  const [editedBook, setEditedBook] = useState(book);

  useEffect(() => {
    setEditedBook(book);
  }, [book]);

  const handleChange = (e) => {
    setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateBook(editedBook._id, editedBook);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
        Edit Book
      </h2>
      <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-6"></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={editedBook.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Author <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="author"
            value={editedBook.author}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            value={editedBook.genre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={editedBook.publishedYear}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
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
              value={editedBook.rating}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            type="submit" 
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition"
          >
            Update Book
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-400 text-white font-bold rounded-lg shadow-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
