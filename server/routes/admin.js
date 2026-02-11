import express from 'express';
import {
  getAllOrders,
  getOrderById,
  getAllRestaurants,
  getRestaurantById,
  reloadDatabase
} from '../data/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all orders for admin
router.get('/orders', (req, res) => {
  try {
    const orders = getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/orders/:id', (req, res) => {
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

// Get all restaurants
router.get('/restaurants', (req, res) => {
  try {
    const restaurants = getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single restaurant
router.get('/restaurants/:id', (req, res) => {
  try {
    const restaurant = getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update restaurant
router.put('/restaurants/:id', (req, res) => {
  try {
    const restaurantId = req.params.id;
    const updates = req.body;
    
    // Load database
    const dbPath = path.join(__dirname, '../../sample-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Find and update restaurant
    const restaurantIndex = dbData.restaurants.findIndex(r => r.id === restaurantId);
    if (restaurantIndex === -1) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Update restaurant fields
    const restaurant = dbData.restaurants[restaurantIndex];
    if (updates.name !== undefined) restaurant.name = updates.name;
    if (updates.description !== undefined) restaurant.description = updates.description;
    if (updates.imageUrl !== undefined) restaurant.imageUrl = updates.imageUrl;
    if (updates.cuisineType !== undefined) restaurant.cuisineType = updates.cuisineType;
    if (updates.rating !== undefined) restaurant.rating = parseFloat(updates.rating);
    if (updates.deliveryTime !== undefined) restaurant.deliveryTime = updates.deliveryTime;
    if (updates.deliveryFee !== undefined) restaurant.deliveryFee = parseFloat(updates.deliveryFee);
    if (updates.location !== undefined) restaurant.location = updates.location;
    if (updates.deliveryApps !== undefined) {
      if (Array.isArray(updates.deliveryApps)) {
        restaurant.deliveryApps = updates.deliveryApps;
      } else if (typeof updates.deliveryApps === 'string') {
        restaurant.deliveryApps = updates.deliveryApps.split(',').map(a => a.trim().toLowerCase()).filter(a => a);
      } else {
        restaurant.deliveryApps = [];
      }
    }
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    
    // Reload in-memory database
    reloadDatabase();
    
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new restaurant
router.post('/restaurants', (req, res) => {
  try {
    const newRestaurant = req.body;
    
    // Load database
    const dbPath = path.join(__dirname, '../../sample-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Generate ID
    const maxId = Math.max(...dbData.restaurants.map(r => parseInt(r.id.split('_')[1]) || 0));
    newRestaurant.id = `rest_${String(maxId + 1).padStart(3, '0')}`;
    
    // Set defaults
    if (!newRestaurant.rating) newRestaurant.rating = 4.0;
    if (!newRestaurant.deliveryTime) newRestaurant.deliveryTime = '30-40 min';
    if (!newRestaurant.deliveryFee) newRestaurant.deliveryFee = 5.0;
    if (!newRestaurant.location) {
      newRestaurant.location = {
        address: '',
        coordinates: { lat: 0, lng: 0 }
      };
    }
    if (!newRestaurant.deliveryApps) newRestaurant.deliveryApps = [];
    
    // Add restaurant
    dbData.restaurants.push(newRestaurant);
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    
    // Reload in-memory database
    reloadDatabase();
    
    res.json({ success: true, restaurant: newRestaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete restaurant
router.delete('/restaurants/:id', (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Load database
    const dbPath = path.join(__dirname, '../../sample-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Check if restaurant has orders
    const hasOrders = dbData.orders.some(o => o.restaurantId === restaurantId);
    if (hasOrders) {
      return res.status(400).json({ error: 'Cannot delete restaurant with existing orders. Delete orders first.' });
    }
    
    // Remove restaurant
    const initialLength = dbData.restaurants.length;
    dbData.restaurants = dbData.restaurants.filter(r => r.id !== restaurantId);
    
    if (dbData.restaurants.length === initialLength) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    
    // Reload in-memory database
    reloadDatabase();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order
router.put('/orders/:id', (req, res) => {
  try {
    const orderId = req.params.id;
    const updates = req.body;
    
    // Load database
    const dbPath = path.join(__dirname, '../../sample-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Find and update order
    const orderIndex = dbData.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update order fields
    const order = dbData.orders[orderIndex];
    if (updates.name !== undefined) order.name = updates.name;
    if (updates.description !== undefined) order.description = updates.description;
    if (updates.price !== undefined) order.price = parseFloat(updates.price);
    if (updates.restaurantId !== undefined) order.restaurantId = updates.restaurantId;
    if (updates.category !== undefined) order.category = updates.category;
    if (updates.cuisineType !== undefined) order.cuisineType = updates.cuisineType;
    if (updates.imageUrl !== undefined) order.imageUrl = updates.imageUrl;
    if (updates.tags !== undefined) {
      if (Array.isArray(updates.tags)) {
        order.tags = updates.tags;
      } else if (typeof updates.tags === 'string') {
        order.tags = updates.tags.split(',').map(t => t.trim()).filter(t => t);
      } else {
        order.tags = [];
      }
    }
    if (updates.deliveryApps !== undefined) {
      order.deliveryApps = Array.isArray(updates.deliveryApps) ? updates.deliveryApps :
                          typeof updates.deliveryApps === 'string' ? updates.deliveryApps.split(',').map(a => a.trim().toLowerCase()) : [];
    }
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    
    // Reload in-memory database
    reloadDatabase();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/orders', (req, res) => {
  try {
    const newOrder = req.body;
    
    // Load database
    const dbPath = path.join(__dirname, '../../sample-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Generate ID
    const maxId = Math.max(...dbData.orders.map(o => parseInt(o.id.split('_')[1]) || 0));
    newOrder.id = `order_${String(maxId + 1).padStart(3, '0')}`;
    
    // Set defaults
    if (!newOrder.likes) newOrder.likes = 0;
    if (!newOrder.likeUsers) newOrder.likeUsers = [];
    if (!newOrder.comments) newOrder.comments = [];
    if (!newOrder.tags) newOrder.tags = [];
    if (!newOrder.deliveryApps) newOrder.deliveryApps = [];
    
    // Add order
    dbData.orders.push(newOrder);
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    
    // Reload in-memory database
    reloadDatabase();
    
    res.json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete('/orders/:id', (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Load database
    const dbPath = path.join(__dirname, '../../sample-database.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    // Remove order
    const initialLength = dbData.orders.length;
    dbData.orders = dbData.orders.filter(o => o.id !== orderId);
    
    if (dbData.orders.length === initialLength) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    
    // Reload in-memory database
    reloadDatabase();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
