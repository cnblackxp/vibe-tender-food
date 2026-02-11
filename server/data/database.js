import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load sample database
const dbPath = path.join(__dirname, '../../sample-database.json');

function loadDatabase() {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return dbData;
}

let dbData = loadDatabase();
let restaurants = [...dbData.restaurants];
let orders = [...dbData.orders];

// Reload database function
export function reloadDatabase() {
  dbData = loadDatabase();
  restaurants = [...dbData.restaurants];
  orders = [...dbData.orders];
}
let swipes = [];
let likes = [];
let comments = [];
let users = [];

// Generate simple user ID
let nextUserId = 1;

// Create or get user
export function getOrCreateUser() {
  // For simplicity, use a single anonymous user
  if (users.length === 0) {
    users.push({
      id: 'user_001',
      createdAt: new Date(),
      preferences: {
        likedCategories: [],
        priceRange: { min: 0, max: 1000 },
        cuisineTypes: []
      }
    });
  }
  return users[0];
}

// Restaurant functions
export function getAllRestaurants() {
  return restaurants;
}

export function getRestaurantById(id) {
  return restaurants.find(r => r.id === id);
}

// Order functions
export function getAllOrders() {
  return orders;
}

export function getOrderById(id) {
  return orders.find(o => o.id === id);
}

export function getOrdersByRestaurant(restaurantId) {
  return orders.filter(o => o.restaurantId === restaurantId);
}

// Swipe functions
export function addSwipe(userId, orderId, action) {
  const swipe = {
    id: `swipe_${Date.now()}`,
    userId,
    orderId,
    action, // 'like' or 'dislike'
    timestamp: new Date()
  };
  swipes.push(swipe);
  
  // Update user preferences
  const user = users.find(u => u.id === userId);
  if (user && action === 'like') {
    const order = getOrderById(orderId);
    if (order) {
      if (!user.preferences.likedCategories.includes(order.category)) {
        user.preferences.likedCategories.push(order.category);
      }
      if (!user.preferences.cuisineTypes.includes(order.cuisineType)) {
        user.preferences.cuisineTypes.push(order.cuisineType);
      }
    }
  }
  
  return swipe;
}

export function getSwipesByUser(userId) {
  return swipes.filter(s => s.userId === userId);
}

// Like functions
export function toggleLike(userId, orderId) {
  const existingLike = likes.find(l => l.userId === userId && l.orderId === orderId);
  const order = getOrderById(orderId);
  
  if (existingLike) {
    // Unlike
    likes = likes.filter(l => l.id !== existingLike.id);
    if (order) {
      order.likes = Math.max(0, order.likes - 1);
      order.likeUsers = order.likeUsers.filter(id => id !== userId);
    }
    return { liked: false };
  } else {
    // Like
    const like = {
      id: `like_${Date.now()}`,
      userId,
      orderId,
      createdAt: new Date()
    };
    likes.push(like);
    if (order) {
      order.likes = (order.likes || 0) + 1;
      if (!order.likeUsers) order.likeUsers = [];
      order.likeUsers.push(userId);
    }
    return { liked: true, like };
  }
}

export function getLikesByOrder(orderId) {
  return likes.filter(l => l.orderId === orderId);
}

export function isLikedByUser(userId, orderId) {
  return likes.some(l => l.userId === userId && l.orderId === orderId);
}

// Comment functions
export function addComment(orderId, userId, username, text) {
  const comment = {
    id: `comment_${Date.now()}`,
    orderId,
    userId,
    username: username || 'Anonymous',
    text,
    createdAt: new Date()
  };
  comments.push(comment);
  
  const order = getOrderById(orderId);
  if (order) {
    if (!order.comments) order.comments = [];
    order.comments.push(comment);
  }
  
  return comment;
}

export function getCommentsByOrder(orderId) {
  return comments.filter(c => c.orderId === orderId);
}

export function deleteComment(commentId, userId) {
  const comment = comments.find(c => c.id === commentId);
  if (!comment || comment.userId !== userId) {
    return false;
  }
  
  comments = comments.filter(c => c.id !== commentId);
  const order = getOrderById(comment.orderId);
  if (order && order.comments) {
    order.comments = order.comments.filter(c => c.id !== commentId);
  }
  
  return true;
}

// Recommendation functions
export function getRecommendations(userId) {
  const user = users.find(u => u.id === userId);
  const userLikes = swipes.filter(s => s.userId === userId && s.action === 'like');
  
  if (!user || userLikes.length < 5) {
    // Not enough data, return popular items
    return {
      restaurants: restaurants.slice(0, 5),
      orders: orders.slice(0, 10)
    };
  }
  
  // Get liked categories and cuisines
  const likedCategories = user.preferences.likedCategories;
  const likedCuisines = user.preferences.cuisineTypes;
  
  // Get orders user actually liked
  const likedOrderIds = userLikes.map(s => s.orderId);
  const likedOrders = likedOrderIds.map(id => getOrderById(id)).filter(Boolean);
  
  // Count how many items user liked from each restaurant
  const restaurantLikeCounts = {};
  likedOrders.forEach(order => {
    restaurantLikeCounts[order.restaurantId] = (restaurantLikeCounts[order.restaurantId] || 0) + 1;
  });
  
  // Score and rank restaurants
  const restaurantScores = restaurants.map(rest => {
    let score = 0;
    const restaurantOrders = getOrdersByRestaurant(rest.id);
    
    // High priority: User liked items from this restaurant
    const likedFromRestaurant = restaurantLikeCounts[rest.id] || 0;
    score += likedFromRestaurant * 10; // 10 points per liked item
    
    // Medium priority: Restaurant has orders matching user's preferred categories
    const matchingCategoryOrders = restaurantOrders.filter(order => 
      likedCategories.includes(order.category)
    ).length;
    score += matchingCategoryOrders * 3;
    
    // Medium priority: Restaurant matches user's preferred cuisine types
    if (likedCuisines.includes(rest.cuisineType)) {
      score += 5;
    }
    
    // Bonus: Restaurant rating
    score += rest.rating || 0;
    
    return {
      restaurant: rest,
      score,
      likedFromRestaurant
    };
  });
  
  // Sort by score (highest first), then by rating
  restaurantScores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.restaurant.rating || 0) - (a.restaurant.rating || 0);
  });
  
  // Get top 5 restaurants
  const topRestaurants = restaurantScores.slice(0, 5).map(item => item.restaurant);
  
  // Score and rank orders
  const orderScores = orders.map(order => {
    let score = 0;
    
    // High priority: User already liked this order
    if (likedOrderIds.includes(order.id)) {
      score += 100; // Very high score for already liked items
    }
    
    // High priority: Order is from a restaurant user liked items from
    const likedFromSameRestaurant = restaurantLikeCounts[order.restaurantId] || 0;
    score += likedFromSameRestaurant * 5;
    
    // Medium priority: Matches user's preferred categories
    if (likedCategories.includes(order.category)) {
      score += 3;
    }
    
    // Medium priority: Matches user's preferred cuisine types
    if (likedCuisines.includes(order.cuisineType)) {
      score += 2;
    }
    
    // Bonus: Order popularity (likes count)
    score += (order.likes || 0) * 0.1;
    
    return {
      order,
      score
    };
  });
  
  // Sort by score (highest first)
  orderScores.sort((a, b) => b.score - a.score);
  
  // Get top 10 orders (excluding already liked ones for variety, but include some)
  const topOrders = orderScores
    .filter(item => !likedOrderIds.includes(item.order.id) || item.score > 100)
    .slice(0, 10)
    .map(item => item.order);
  
  // If we don't have enough, add some already liked ones
  if (topOrders.length < 10) {
    const alreadyLiked = orderScores
      .filter(item => likedOrderIds.includes(item.order.id))
      .slice(0, 10 - topOrders.length)
      .map(item => item.order);
    topOrders.push(...alreadyLiked);
  }
  
  return {
    restaurants: topRestaurants,
    orders: topOrders.slice(0, 10)
  };
}
