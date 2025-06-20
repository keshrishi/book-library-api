import React, { useState, useEffect } from 'react';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import axios from 'axios';
import './index.css';

function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:4000/api/books');
    setBooks(response.data);
  };

  const handleAddBook = async (book) => {
    const response = await axios.post('http://localhost:4000/api/books', book);
    setBooks([...books, response.data]);
  };

  const handleUpdateBook = async (id, updatedBook) => {
    await axios.put(`http://localhost:4000/api/books/${id}`, updatedBook);
    setBooks(books.map(book => book._id === id ? {...book, ...updatedBook} : book));
    setEditingBook(null);
  };

  const handleDeleteBook = async (id) => {
    await axios.delete(`http://localhost:4000/api/books/${id}`);
    setBooks(books.filter(book => book._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-700 text-transparent bg-clip-text drop-shadow-lg">
            Book Library
          </h1>
          <p className="mt-3 text-lg text-gray-600">Your personal digital book collection</p>
        </header>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Book</h2>
            <AddBook onAddBook={handleAddBook} />
            {editingBook && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Book</h2>
                <EditBook 
                  book={editingBook} 
                  onUpdateBook={handleUpdateBook} 
                  onCancel={() => setEditingBook(null)} 
                />
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Books <span className="text-base font-normal text-gray-500">({books.length})</span>
            </h2>
            <BookList 
              books={books} 
              onEditBook={setEditingBook} 
              onDeleteBook={handleDeleteBook} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
