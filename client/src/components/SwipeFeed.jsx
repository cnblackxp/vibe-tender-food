import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { deliveryApps } from '../utils/deeplink';
import './SwipeFeed.css';

function SwipeFeed({ orders, currentIndex, onSwipe, onOrderClick }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [nextOrder, setNextOrder] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const controls = useAnimation();

  useEffect(() => {
    if (orders[currentIndex]) {
      setCurrentOrder(orders[currentIndex]);
    }
    if (orders[currentIndex + 1]) {
      setNextOrder(orders[currentIndex + 1]);
    }
  }, [orders, currentIndex]);

  const handleDragEnd = async (event, info) => {
    setIsDragging(false);
    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      await controls.start({
        x: info.offset.x > 0 ? 1000 : -1000,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      
      if (currentOrder) {
        onSwipe(currentOrder.id, direction);
      }
      
      // Reset position
      x.set(0);
      controls.start({ x: 0, opacity: 1 });
    } else {
      // Snap back
      controls.start({ x: 0, opacity: 1 });
    }
  };

  if (!currentOrder) {
    return (
      <div className="swipe-feed">
        <div className="end-message">
          <h2>You've seen all orders!</h2>
          <p>Check back later for more delicious options</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-feed">
      <div className="swipe-container">
        {/* Next card (peeking) */}
        {nextOrder && (
          <motion.div
            className="food-card next-card"
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 0.95, opacity: 0.5 }}
          >
            <div className="card-image" style={{ backgroundImage: `url(${nextOrder.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop'})` }}>
              <div className="card-overlay">
                <h2 className="card-title">{nextOrder.name}</h2>
                <p className="card-price">SAR {nextOrder.price.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Current card (swipeable) */}
        <motion.div
          className="food-card current-card"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity }}
          animate={controls}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <div className="card-image" style={{ backgroundImage: `url(${currentOrder.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop'})` }}>
            <div className="card-overlay">
              <div className="card-header">
                <button
                  className="detail-btn"
                  onClick={() => onOrderClick(currentOrder)}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </button>
              </div>
              <div className="card-content">
                <h2 className="card-title">{currentOrder.name}</h2>
                <p className="card-description">{currentOrder.description}</p>
                <p className="card-price">SAR {currentOrder.price.toFixed(2)}</p>
                {currentOrder.deliveryApps && currentOrder.deliveryApps.length > 0 && (
                  <div className="delivery-apps-badges">
                    {currentOrder.deliveryApps.map((app, idx) => {
                      const appConfig = deliveryApps[app.toLowerCase()];
                      if (!appConfig) return null;
                      return (
                        <span key={idx} className="delivery-badge" style={{ backgroundColor: appConfig.color }}>
                          {appConfig.icon} {appConfig.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="swipe-hints">
                <div className="hint-left">👎</div>
                <div className="hint-right">👍</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action buttons for mobile */}
      <div className="action-buttons">
        <button
          className="action-btn dislike-btn"
          onClick={() => onSwipe(currentOrder.id, 'left')}
        >
          ✕
        </button>
        <button
          className="action-btn like-btn"
          onClick={() => onSwipe(currentOrder.id, 'right')}
        >
          ♥
        </button>
      </div>
    </div>
  );
}

export default SwipeFeed;
