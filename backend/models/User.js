const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },

  // Subscription system
  subscription: { type: Number, default: 0 }, // 0=Free,1=Monthly,2=Yearly
  subscription_expiry: { type: Date, default: null },

  paymentId: { type: String, default: null },

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
