import express from 'express';
import {
  addSwipe,
  getSwipesByUser,
  getOrCreateUser
} from '../data/database.js';

const router = express.Router();

// Record a swipe
router.post('/', (req, res) => {
  try {
    const { orderId, action } = req.body;
    const user = getOrCreateUser();
    
    if (!orderId || !action || !['like', 'dislike'].includes(action)) {
      return res.status(400).json({ error: 'Invalid request. Need orderId and action (like/dislike)' });
    }
    
    const swipe = addSwipe(user.id, orderId, action);
    res.json(swipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's swipe history
router.get('/history', (req, res) => {
  try {
    const user = getOrCreateUser();
    const swipes = getSwipesByUser(user.id);
    res.json(swipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
