// backend/routes/payment.js
const express = require('express');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Lazy Razorpay init (safe if .env not yet configured)
function getRazorInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_SECRET;
  if (!key_id || !key_secret) return null;
  // require here so server won't crash on missing keys
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id, key_secret });
}

/**
 * POST /api/payment/create-order
 * body: { planType } // 1 = monthly (₹1), 2 = yearly (₹5)
 * returns { order }
 */
router.post('/create-order', auth, async (req, res) => {
  const { planType } = req.body;
  if (![1, 2].includes(planType)) return res.status(400).json({ message: 'Invalid planType' });

  const razor = getRazorInstance();
  if (!razor) return res.status(500).json({ message: 'Razorpay keys not configured on server' });

  // amounts in paise
  const amount = planType === 1 ? 1 * 100 : 5 * 100;

  const options = {
    amount,
    currency: 'INR',
    receipt: 'order_' + Date.now(),
  };

  try {
    const order = await razor.orders.create(options);
    res.json({ order });
  } catch (err) {
    console.error('create-order err', err);
    res.status(500).json({ message: err?.message || 'Failed to create order' });
  }
});

/**
 * POST /api/payment/verify
 * body: { razorpay_payment_id, razorpay_order_id, razorpay_signature, planType }
 * verifies signature, updates user subscription and expiry, returns sanitized user
 */
router.post('/verify', auth, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planType } = req.body;
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment fields' });
  }
  if (![1,2].includes(planType)) return res.status(400).json({ message: 'Invalid planType' });

  const key_secret = process.env.RAZORPAY_SECRET;
  if (!key_secret) return res.status(500).json({ message: 'Razorpay secret not configured' });

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto.createHmac('sha256', key_secret).update(sign).digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscription = planType;
    user.paymentId = razorpay_payment_id;

    const now = new Date();
    if (planType === 1) {
      // monthly: +30 days
      user.subscription_expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
      // yearly: +365 days
      user.subscription_expiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }

    await user.save();

    const { passwordHash, __v, ...safeUser } = user.toObject();
    res.json({ message: 'Payment verified', user: safeUser });
  } catch (err) {
    console.error('verify err', err);
    res.status(500).json({ message: err?.message || 'Verification failed' });
  }
});

module.exports = router;
