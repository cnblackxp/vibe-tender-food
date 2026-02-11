import { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'restaurants'
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [isNewRestaurant, setIsNewRestaurant] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, restaurantsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/restaurants')
      ]);
      const ordersData = await ordersRes.json();
      const restaurantsData = await restaurantsRes.json();
      setOrders(ordersData);
      setRestaurants(restaurantsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
    setIsNewOrder(false);
  };

  const handleNewOrder = () => {
    setEditingOrder({
      name: '',
      description: '',
      price: 0,
      restaurantId: restaurants[0]?.id || '',
      category: '',
      cuisineType: '',
      tags: [],
      deliveryApps: [],
      imageUrl: ''
    });
    setIsNewOrder(true);
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant({ ...restaurant });
    setIsNewRestaurant(false);
  };

  const handleNewRestaurant = () => {
    setEditingRestaurant({
      name: '',
      description: '',
      imageUrl: '',
      cuisineType: '',
      rating: 4.0,
      deliveryTime: '30-40 min',
      deliveryFee: 5.0,
      location: {
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      deliveryApps: []
    });
    setIsNewRestaurant(true);
  };

  const handleSaveOrder = async () => {
    try {
      const url = isNewOrder 
        ? '/api/admin/orders'
        : `/api/admin/orders/${editingOrder.id}`;
      const method = isNewOrder ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOrder)
      });

      if (response.ok) {
        await fetchData();
        setEditingOrder(null);
        setIsNewOrder(false);
        alert(isNewOrder ? 'Order created successfully!' : 'Order updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order');
    }
  };

  const handleSaveRestaurant = async () => {
    try {
      const url = isNewRestaurant 
        ? '/api/admin/restaurants'
        : `/api/admin/restaurants/${editingRestaurant.id}`;
      const method = isNewRestaurant ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRestaurant)
      });

      if (response.ok) {
        await fetchData();
        setEditingRestaurant(null);
        setIsNewRestaurant(false);
        alert(isNewRestaurant ? 'Restaurant created successfully!' : 'Restaurant updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Error saving restaurant');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
        alert('Order deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!confirm('Are you sure you want to delete this restaurant? This will fail if it has orders.')) return;

    try {
      const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
        alert('Restaurant deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Error deleting restaurant');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🍔 FoodTinder CMS</h1>
        <p>Manage Orders & Restaurants</p>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Orders
            </button>
            <button 
              className={`tab ${activeTab === 'restaurants' ? 'active' : ''}`}
              onClick={() => setActiveTab('restaurants')}
            >
              🍽️ Restaurants
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Restaurants</span>
              <span className="stat-value">{restaurants.length}</span>
            </div>
          </div>

          <div className="add-buttons">
            {activeTab === 'orders' && (
              <button className="btn-add" onClick={handleNewOrder}>
                + Add New Order
              </button>
            )}
            {activeTab === 'restaurants' && (
              <button className="btn-add" onClick={handleNewRestaurant}>
                + Add New Restaurant
              </button>
            )}
          </div>
        </div>

        <div className="admin-main">
          {editingOrder ? (
            <OrderEditForm
              order={editingOrder}
              setOrder={setEditingOrder}
              restaurants={restaurants}
              onSave={handleSaveOrder}
              onCancel={() => {
                setEditingOrder(null);
                setIsNewOrder(false);
              }}
              isNew={isNewOrder}
            />
          ) : editingRestaurant ? (
            <RestaurantEditForm
              restaurant={editingRestaurant}
              setRestaurant={setEditingRestaurant}
              onSave={handleSaveRestaurant}
              onCancel={() => {
                setEditingRestaurant(null);
                setIsNewRestaurant(false);
              }}
              isNew={isNewRestaurant}
            />
          ) : activeTab === 'orders' ? (
            <OrdersList
              orders={filteredOrders}
              restaurants={restaurants}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
            />
          ) : (
            <RestaurantsList
              restaurants={filteredRestaurants}
              onEdit={handleEditRestaurant}
              onDelete={handleDeleteRestaurant}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function OrderEditForm({ order, setOrder, restaurants, onSave, onCancel, isNew }) {
  return (
    <div className="edit-panel">
      <div className="edit-header">
        <h2>{isNew ? 'Create New Order' : `Edit Order: ${order.name}`}</h2>
        <button className="btn-close" onClick={onCancel}>✕</button>
      </div>

      <div className="edit-form">
        <div className="form-with-preview">
          <div className="form-fields">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={order.name}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={order.description}
                onChange={(e) => setOrder({ ...order, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (SAR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={order.price}
                  onChange={(e) => setOrder({ ...order, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label>Restaurant</label>
                <select
                  value={order.restaurantId}
                  onChange={(e) => setOrder({ ...order, restaurantId: e.target.value })}
                >
                  {restaurants.map(rest => (
                    <option key={rest.id} value={rest.id}>{rest.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={order.category}
                  onChange={(e) => setOrder({ ...order, category: e.target.value })}
                  placeholder="e.g., Burgers, Pizza, Sushi"
                />
              </div>

              <div className="form-group">
                <label>Cuisine Type</label>
                <input
                  type="text"
                  value={order.cuisineType}
                  onChange={(e) => setOrder({ ...order, cuisineType: e.target.value })}
                  placeholder="e.g., Fast Food, Italian, Japanese"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(order.tags) ? order.tags.join(', ') : (order.tags || '')}
                onChange={(e) => setOrder({ 
                  ...order, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                })}
                placeholder="e.g., spicy, vegetarian, fast-food"
              />
            </div>

            <div className="form-group">
              <label>Delivery Apps (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(order.deliveryApps) ? order.deliveryApps.join(', ') : (order.deliveryApps || '')}
                onChange={(e) => setOrder({ 
                  ...order, 
                  deliveryApps: e.target.value.split(',').map(a => a.trim().toLowerCase()).filter(a => a)
                })}
                placeholder="e.g., careem, talabat, ubereats"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={order.imageUrl || ''}
                onChange={(e) => setOrder({ ...order, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="image-preview">
            <label>Image Preview</label>
            <div 
              className="preview-image"
              style={{ 
                backgroundImage: `url(${order.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop'})` 
              }}
            />
            {order.imageUrl && (
              <p className="preview-note">Preview of the food image</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={onSave}>
            {isNew ? 'Create Order' : 'Save Changes'}
          </button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function RestaurantEditForm({ restaurant, setRestaurant, onSave, onCancel, isNew }) {
  return (
    <div className="edit-panel">
      <div className="edit-header">
        <h2>{isNew ? 'Create New Restaurant' : `Edit Restaurant: ${restaurant.name}`}</h2>
        <button className="btn-close" onClick={onCancel}>✕</button>
      </div>

      <div className="edit-form">
        <div className="form-with-preview">
          <div className="form-fields">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={restaurant.name}
                onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={restaurant.description}
                onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cuisine Type</label>
                <input
                  type="text"
                  value={restaurant.cuisineType}
                  onChange={(e) => setRestaurant({ ...restaurant, cuisineType: e.target.value })}
                  placeholder="e.g., Fast Food, Italian, Japanese"
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={restaurant.rating}
                  onChange={(e) => setRestaurant({ ...restaurant, rating: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Delivery Time</label>
                <input
                  type="text"
                  value={restaurant.deliveryTime}
                  onChange={(e) => setRestaurant({ ...restaurant, deliveryTime: e.target.value })}
                  placeholder="e.g., 20-30 min"
                />
              </div>

              <div className="form-group">
                <label>Delivery Fee (SAR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={restaurant.deliveryFee}
                  onChange={(e) => setRestaurant({ ...restaurant, deliveryFee: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={restaurant.location?.address || ''}
                onChange={(e) => setRestaurant({ 
                  ...restaurant, 
                  location: { ...restaurant.location, address: e.target.value }
                })}
                placeholder="Restaurant address"
              />
            </div>

            <div className="form-group">
              <label>Delivery Apps (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(restaurant.deliveryApps) ? restaurant.deliveryApps.join(', ') : (restaurant.deliveryApps || '')}
                onChange={(e) => setRestaurant({ 
                  ...restaurant, 
                  deliveryApps: e.target.value.split(',').map(a => a.trim().toLowerCase()).filter(a => a)
                })}
                placeholder="e.g., careem, talabat, ubereats"
              />
              <small className="form-hint">Which delivery apps have this restaurant?</small>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={restaurant.imageUrl || ''}
                onChange={(e) => setRestaurant({ ...restaurant, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="image-preview">
            <label>Image Preview</label>
            <div 
              className="preview-image"
              style={{ 
                backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'})` 
              }}
            />
            {restaurant.imageUrl && (
              <p className="preview-note">Preview of the restaurant image</p>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={onSave}>
            {isNew ? 'Create Restaurant' : 'Save Changes'}
          </button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function OrdersList({ orders, restaurants, onEdit, onDelete }) {
  return (
    <div className="list-view">
      <div className="list-header">
        <h2>Orders ({orders.length})</h2>
      </div>
      <div className="orders-grid">
        {orders.map(order => {
          const restaurant = restaurants.find(r => r.id === order.restaurantId);
          return (
            <div key={order.id} className="order-card-admin">
              <div 
                className="order-image-admin"
                style={{ backgroundImage: `url(${order.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'})` }}
              />
              <div className="order-info-admin">
                <h3>{order.name}</h3>
                <p className="order-restaurant">{restaurant?.name || 'Unknown'}</p>
                <p className="order-description-small">{order.description}</p>
                <div className="order-meta-admin">
                  <span className="order-price-admin">SAR {order.price.toFixed(2)}</span>
                  <span className="order-category-admin">{order.category}</span>
                </div>
                <div className="order-tags-admin">
                  {order.tags && order.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="order-actions">
                  <button className="btn-edit" onClick={() => onEdit(order)}>Edit</button>
                  <button className="btn-delete" onClick={() => onDelete(order.id)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RestaurantsList({ restaurants, onEdit, onDelete }) {
  return (
    <div className="list-view">
      <div className="list-header">
        <h2>Restaurants ({restaurants.length})</h2>
      </div>
      <div className="restaurants-grid">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="restaurant-card-admin">
            <div 
              className="restaurant-image-admin"
              style={{ backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'})` }}
            />
            <div className="restaurant-info-admin">
              <h3>{restaurant.name}</h3>
              <p className="restaurant-cuisine-admin">{restaurant.cuisineType}</p>
              <p className="restaurant-description-admin">{restaurant.description}</p>
              <div className="restaurant-meta-admin">
                <span className="restaurant-rating-admin">⭐ {restaurant.rating}</span>
                <span className="restaurant-delivery-admin">⏱️ {restaurant.deliveryTime}</span>
                <span className="restaurant-fee-admin">💰 SAR {restaurant.deliveryFee.toFixed(2)}</span>
              </div>
              {restaurant.deliveryApps && restaurant.deliveryApps.length > 0 && (
                <div className="restaurant-delivery-apps">
                  <span className="delivery-label-small">Available on:</span>
                  <div className="delivery-badges-small">
                    {restaurant.deliveryApps.map((app, idx) => (
                      <span key={idx} className="delivery-badge-small">{app}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="restaurant-actions">
                <button className="btn-edit" onClick={() => onEdit(restaurant)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(restaurant.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
