const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ---------------------- CREATE ORDER ----------------------
router.post('/create-order', auth, async (req, res) => {
  const { planType } = req.body; // 1=monthly, 2=yearly

  const amount = planType === 1 ? 19900 : 99900; // ₹199 or ₹999

  const options = {
    amount: amount,
    currency: "INR",
    receipt: "order_" + Date.now(),
  };

  try {
    const order = await razor.orders.create(options);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- VERIFY PAYMENT --------------------
router.post('/verify', auth, async (req, res) => {
  const { 
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_signature, 
    planType 
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  // Update subscription
  const user = await User.findById(req.user.id);
  
  user.subscription = planType;
  user.paymentId = razorpay_payment_id;

  const now = new Date();
  if (planType === 1) {
    user.subscription_expiry = new Date(now.setMonth(now.getMonth() + 1));
  } else {
    user.subscription_expiry = new Date(now.setFullYear(now.getFullYear() + 1));
  }

  await user.save();

  res.json({ message: "Payment verified", user });
});

module.exports = router;
