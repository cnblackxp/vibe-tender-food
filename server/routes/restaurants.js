import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getOrdersByRestaurant
} from '../data/database.js';

const router = express.Router();

// Get all restaurants
router.get('/', (req, res) => {
  try {
    const restaurants = getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', (req, res) => {
  try {
    const restaurant = getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Include orders
    const orders = getOrdersByRestaurant(req.params.id);
    res.json({ ...restaurant, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
