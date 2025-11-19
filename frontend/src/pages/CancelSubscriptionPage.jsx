// frontend/src/pages/CancelSubscriptionPage.jsx
import React from "react";
import API from "../api";

export default function CancelSubscriptionPage() {
  async function cancelNow() {
    try {
      await API.post('/subscription/cancel', { refund: true });
      const updatedUser = {
        ...(JSON.parse(localStorage.getItem('user')) || {}),
        subscription: 0,
        subscription_expiry: null,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));

      alert('Subscription cancelled.');
    } catch (err) {
      console.error('cancel err', err);
      alert('Error cancelling subscription.');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Cancel Subscription</h1>
      <p className="mb-4 text-gray-300">Are you sure you want to cancel your subscription?</p>
      <button onClick={cancelNow} className="px-4 py-2 bg-red-600 rounded">Cancel Subscription</button>
    </div>
  );
}
