import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRoutes from './routes/orders.js';
import restaurantsRoutes from './routes/restaurants.js';
import swipesRoutes from './routes/swipes.js';
import likesRoutes from './routes/likes.js';
import commentsRoutes from './routes/comments.js';
import recommendationsRoutes from './routes/recommendations.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FoodTinder API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
