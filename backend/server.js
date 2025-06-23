import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
