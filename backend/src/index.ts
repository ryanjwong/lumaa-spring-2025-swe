import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

// Load environment variables
dotenv.config();

// Express app setup
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});