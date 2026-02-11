import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SwipeFeed from './components/SwipeFeed';
import OrderDetail from './components/OrderDetail';
import Recommendations from './components/Recommendations';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  
  const [orders, setOrders] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swipeCount, setSwipeCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSwipe = async (orderId, direction) => {
    try {
      const action = direction === 'right' ? 'like' : 'dislike';
      await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          action
        })
      });

      // Update counts
      setSwipeCount(prev => prev + 1);
      if (action === 'like') {
        setLikeCount(prev => prev + 1);
      }

      // Move to next order
      if (currentOrderIndex < orders.length - 1) {
        setCurrentOrderIndex(currentOrderIndex + 1);
      } else {
        // Reset or show end message
        setCurrentOrderIndex(0);
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const handleOrderClick = (order) => {
    setShowDetail(order);
  };

  const handleCloseDetail = () => {
    setShowDetail(null);
  };

  const handleShowRecommendations = () => {
    setShowRecommendations(true);
  };

  const handleCloseRecommendations = () => {
    setShowRecommendations(false);
  };

  // Check if recommendations button should be shown
  const showRecommendationsButton = swipeCount >= 10 && likeCount >= 2;

  if (isAdmin) {
    return <Admin />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading delicious food...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="loading-container">
        <p>No orders available</p>
      </div>
    );
  }

  return (
    <div className="app">
      {showRecommendations ? (
        <Recommendations onClose={handleCloseRecommendations} />
      ) : showDetail ? (
        <OrderDetail
          order={showDetail}
          onClose={handleCloseDetail}
        />
      ) : (
        <>
          <SwipeFeed
            orders={orders}
            currentIndex={currentOrderIndex}
            onSwipe={handleSwipe}
            onOrderClick={handleOrderClick}
          />
          {showRecommendationsButton && (
            <button
              className="recommendations-button"
              onClick={handleShowRecommendations}
            >
              🎯 View Recommendations
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;
