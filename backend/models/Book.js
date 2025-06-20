import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  publishedYear: { type: Number },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
