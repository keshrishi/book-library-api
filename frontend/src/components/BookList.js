import React from 'react';

const BookList = ({ books, onEditBook, onDeleteBook }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" className="text-purple-400"><path d="M6 4v16M18 20V4M6 4h12v16H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Book Collection
      </h2>
      {books.length === 0 ? (
        <p className="text-gray-500 italic">No books in the library</p>
      ) : (
        <div className="space-y-6">
          {books.map(book => (
            <div
              key={book._id}
              className="rounded-xl bg-white/70 shadow border border-indigo-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 p-5 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <h3 className="font-extrabold text-lg text-indigo-700">{book.title}</h3>
                <p className="text-gray-700 mb-1">by <span className="font-semibold">{book.author}</span></p>
                <div className="text-sm text-gray-600 space-x-3">
                  {book.genre && <span>Genre: <span className="font-medium text-purple-500">{book.genre}</span></span>}
                  {book.publishedYear && <span>Year: <span className="font-medium">{book.publishedYear}</span></span>}
                  {book.rating && <span>Rating: <span className="font-medium text-yellow-500">{book.rating}/5</span></span>}
                </div>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => onEditBook(book)}
                  className="px-4 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteBook(book._id)}
                  className="px-4 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow hover:from-red-600 hover:to-pink-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
