import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

const PORT = process.env.PORT || 8081;
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)

  .then(() => {
    console.log('MongoDB connected');
    console.log('Database', mongoose.connection.name);

  }
  )
  .catch(err => {
    console.error('mongodb connection error', err.message);
    process.exit(1);

  });



app.use('/api/auth', authRoutes);




app.get('/', (req, res) => {
  res.send('Backend running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
