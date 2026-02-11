import express from 'express';
import {
  getRecommendations,
  getOrCreateUser
} from '../data/database.js';

const router = express.Router();

// Get personalized recommendations
router.get('/', (req, res) => {
  try {
    const user = getOrCreateUser();
    const recommendations = getRecommendations(user.id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
