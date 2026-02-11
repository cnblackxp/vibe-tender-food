import { useState, useEffect } from 'react';
import { openDeepLink, deliveryApps } from '../utils/deeplink';
import './Recommendations.css';

function Recommendations({ onClose }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      setRecommendations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Restaurant';
  };

  if (loading) {
    return (
      <div className="recommendations">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="recommendations">
        <div className="recommendations-header">
          <button className="close-btn" onClick={onClose}>✕</button>
          <h1>Recommendations</h1>
        </div>
        <div className="recommendations-content">
          <p>Unable to load recommendations. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <div className="recommendations-header">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h1>🎯 Your Recommendations</h1>
        <p className="subtitle">Based on your preferences</p>
      </div>

      <div className="recommendations-content">
        {recommendations.restaurants && recommendations.restaurants.length > 0 && (
          <section className="recommendations-section">
            <h2>🍽️ Recommended Restaurants</h2>
            <div className="restaurants-grid">
              {recommendations.restaurants.map(restaurant => (
                <div key={restaurant.id} className="restaurant-card">
                  <div className="restaurant-image">
                    <div className="image-placeholder">
                      {restaurant.name.charAt(0)}
                    </div>
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p className="restaurant-cuisine">{restaurant.cuisineType}</p>
                    <p className="restaurant-description">{restaurant.description}</p>
                    <div className="restaurant-meta">
                      <span className="rating">⭐ {restaurant.rating}</span>
                      <span className="delivery-time">⏱️ {restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {recommendations.orders && recommendations.orders.length > 0 && (
          <section className="recommendations-section">
            <h2>🍔 Recommended Orders</h2>
            <div className="orders-list">
              {recommendations.orders.map(order => {
                const restaurantName = getRestaurantName(order.restaurantId);
                return (
                  <div key={order.id} className="order-card">
                    <div 
                      className="order-image"
                      style={{ backgroundImage: `url(${order.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop'})` }}
                    />
                    <div className="order-info">
                      <h3>{order.name}</h3>
                      <p className="order-description">{order.description}</p>
                      <div className="order-meta">
                        <span className="order-price">SAR {order.price.toFixed(2)}</span>
                        <span className="order-category">{order.category}</span>
                      </div>
                      {order.deliveryApps && order.deliveryApps.length > 0 && (
                        <div className="order-delivery-apps">
                          <p className="delivery-label">Order from:</p>
                          <div className="delivery-buttons">
                            {order.deliveryApps.map((app, idx) => {
                              const appConfig = deliveryApps[app.toLowerCase()];
                              if (!appConfig) return null;
                              return (
                                <button
                                  key={idx}
                                  className="delivery-button"
                                  style={{ backgroundColor: appConfig.color }}
                                  onClick={() => openDeepLink(app.toLowerCase(), restaurantName, order.name)}
                                >
                                  {appConfig.icon} {appConfig.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {(!recommendations.restaurants || recommendations.restaurants.length === 0) &&
         (!recommendations.orders || recommendations.orders.length === 0) && (
          <div className="no-recommendations">
            <p>Keep swiping to get personalized recommendations!</p>
            <p className="hint">Like at least 2 items after viewing 10 orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
