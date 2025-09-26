const express = require('express');
const {
  getUserProfile,
  getUserProperties,
  getAgents,
  updateUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/agents', getAgents);
router.get('/:id', getUserProfile);
router.get('/:id/properties', getUserProperties);

// Admin routes (protected)
router.put('/:id', protect, authorize('admin'), updateUser);

module.exports = router;