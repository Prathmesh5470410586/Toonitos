// backend/routes/subscription.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/subscription/cancel
 * Cancels subscription (sets subscription = 0)
 */
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscription = 0;
    user.subscription_expiry = null;
    user.paymentId = null;

    await user.save();

    res.json({ message: 'Subscription cancelled', subscription: 0 });
  } catch (err) {
    console.error('cancel err', err);
    res.status(500).json({ message: err?.message || 'Cancel failed' });
  }
});

/**
 * GET /api/subscription/status
 * Returns user (sanitized)
 */
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { passwordHash, __v, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error('status err', err);
    res.status(500).json({ message: err?.message || 'Status error' });
  }
});

module.exports = router;
