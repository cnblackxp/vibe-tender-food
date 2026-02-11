import express from 'express';
import {
  toggleLike,
  getLikesByOrder,
  isLikedByUser,
  getOrCreateUser
} from '../data/database.js';

const router = express.Router();

// Like/unlike an order
router.post('/orders/:orderId', (req, res) => {
  try {
    const user = getOrCreateUser();
    const result = toggleLike(user.id, req.params.orderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get likes for an order
router.get('/orders/:orderId', (req, res) => {
  try {
    const likes = getLikesByOrder(req.params.orderId);
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user liked an order
router.get('/orders/:orderId/status', (req, res) => {
  try {
    const user = getOrCreateUser();
    const liked = isLikedByUser(user.id, req.params.orderId);
    res.json({ liked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
