// backend/jobs/expireSubscriptions.js
const cron = require('node-cron');
const User = require('../models/User');

function startExpireJob() {
  // Run once a day at 01:00 server time
  cron.schedule('0 1 * * *', async () => {
    console.log('[cron] running subscription expiry job');
    try {
      const now = new Date();
      const res = await User.updateMany(
        { subscription: { $ne: 0 }, subscription_expiry: { $lte: now } },
        { $set: { subscription: 0, subscription_expiry: null, paymentId: null } }
      );
      console.log(`[cron] expired ${res.modifiedCount || res.nModified || 0} subscriptions`);
    } catch (err) {
      console.error('[cron] expiry job error', err);
    }
  });
}

module.exports = startExpireJob;
