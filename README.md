Book Library API
A full-stack application to manage a personal digital library. Built with Express.js, MongoDB, and React, this project allows you to add, view, edit, and delete books in your collection.

Features
Add, view, edit, and delete books
Fields: title, author, genre, publishedYear, rating
Clean, modern frontend built with React and Tailwind CSS
RESTful API with Express and MongoDB

Tech Stack
Backend: Node.js, Express.js, MongoDB, Mongoose
Frontend: React, Tailwind CSS, Axios

API Documentation:
https://documenter.getpostman.com/view/40638998/2sB2xBCpWD

Getting Started
1. Clone the Repository
bash
git clone <your-repo-url>
cd book-library-api
2. Backend Setup
bash
cd backend
npm install
Create a .env file in the backend directory:

text
MONGO_URI=your_mongodb_connection_string
PORT=4000
Start the backend server:

bash
npm start
The server will run on http://localhost:4000.

3. Frontend Setup
bash
cd ../frontend
npm install
npm start
The React app will run on http://localhost:3000.

API Documentation
Full API documentation is available via Postman:
👉 View the API Docs on Postman

API Endpoints
Method	Endpoint	Description
GET	/api/books	Get all books
POST	/api/books	Add a new book
PUT	/api/books/:id	Edit book info
DELETE	/api/books/:id	Remove a book
Sample Book JSON
json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help",
  "publishedYear": 2018,
  "rating": 4.6
}
Testing the API with curl
Get all books

bash
curl http://localhost:4000/api/books
Add a new book

bash
curl -X POST http://localhost:4000/api/books \
-H "Content-Type: application/json" \
-d '{"title":"Atomic Habits","author":"James Clear","genre":"Self-help","publishedYear":2018,"rating":4.6}'
Edit a book

bash
curl -X PUT http://localhost:4000/api/books/<book_id> \
-H "Content-Type: application/json" \
-d '{"title":"Atomic Habits (Updated)","author":"James Clear","genre":"Self-help","publishedYear":2018,"rating":4.8}'
Delete a book

bash
curl -X DELETE http://localhost:4000/api/books/<book_id>
Screenshots
Add screenshots of your app UI here if desired.

License
MIT

API Documentation:
https://documenter.getpostman.com/view/40638998/2sB2xBCpWD
