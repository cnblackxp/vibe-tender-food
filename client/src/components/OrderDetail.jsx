import { useState, useEffect } from 'react';
import './OrderDetail.css';

function OrderDetail({ order, onClose }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(order.likes || 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikeStatus();
    fetchComments();
  }, [order.id]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/likes/orders/${order.id}/status`);
      const data = await response.json();
      setLiked(data.liked);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/orders/${order.id}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/likes/orders/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/comments/orders/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment,
          username: 'You'
        })
      });
      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-detail">
      <div className="detail-header">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="detail-image-container">
        <div
          className="detail-image"
          style={{ backgroundImage: `url(${order.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop'})` }}
        />
      </div>

      <div className="detail-content">
        <div className="detail-info">
          <h1 className="detail-title">{order.name}</h1>
          <p className="detail-description">{order.description}</p>
          <p className="detail-price">SAR {order.price.toFixed(2)}</p>
        </div>

        <div className="detail-actions">
          <button
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <span className="heart-icon">{liked ? '❤️' : '🤍'}</span>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>

        <div className="comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>
          
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <form className="comment-form" onSubmit={handleAddComment}>
            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="comment-submit"
              disabled={!newComment.trim() || loading}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
