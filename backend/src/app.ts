import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import campaignRoutes from './routes/campaign.routes';
import messageRoutes from './routes/message.routes';
import scraperRoutes from './routes/scraper.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Add this line before the error handling middleware

// Routes
app.use('/campaigns', campaignRoutes);
app.use('/personalized-message', messageRoutes);
app.use('/scraper', scraperRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});