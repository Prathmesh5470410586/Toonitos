// backend/routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET current user (optional helpful endpoint)
router.get('/me', auth, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).lean();
    if (!u) return res.status(404).json({ message: 'User not found' });
    // remove sensitive fields
    const { passwordHash, __v, ...user } = u;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/subscribe  -> set subscription = 1
router.post('/subscribe', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscription = 1;
    await user.save();

    res.json({ message: 'Subscription activated', subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user/cancel -> set subscription = 0
router.post('/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscription = 0;
    await user.save();

    res.json({ message: 'Subscription cancelled', subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
