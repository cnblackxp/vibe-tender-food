import express from 'express';
import {
  getAllOrders,
  getOrderById,
  getOrdersByRestaurant
} from '../data/database.js';

const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by restaurant
router.get('/restaurant/:restaurantId', (req, res) => {
  try {
    const orders = getOrdersByRestaurant(req.params.restaurantId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
