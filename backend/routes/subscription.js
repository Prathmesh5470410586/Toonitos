const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// ---------------- Cancel Subscription --------------------
router.post('/cancel', auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.subscription = 0;
  user.subscription_expiry = null;
  user.paymentId = null;

  await user.save();

  res.json({ message: "Subscription cancelled", subscription: 0 });
});

// ---------------- Status Route --------------------
router.get('/status', auth, async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  res.json(user);
});

module.exports = router;
