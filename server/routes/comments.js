import express from 'express';
import {
  addComment,
  getCommentsByOrder,
  deleteComment,
  getOrCreateUser
} from '../data/database.js';

const router = express.Router();

// Add a comment to an order
router.post('/orders/:orderId', (req, res) => {
  try {
    const { text, username } = req.body;
    const user = getOrCreateUser();
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const comment = addComment(req.params.orderId, user.id, username, text);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments for an order
router.get('/orders/:orderId', (req, res) => {
  try {
    const comments = getCommentsByOrder(req.params.orderId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/:commentId', (req, res) => {
  try {
    const user = getOrCreateUser();
    const deleted = deleteComment(req.params.commentId, user.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
