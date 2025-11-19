// frontend/src/pages/SubscriptionPage.jsx
import React from 'react';
import API from '../api';

export default function SubscriptionPage() {

  async function startPayment(planType) {
    try {
      // 1) create order on backend
      const orderRes = await API.post('/payment/create-order', { planType });
      const { order } = orderRes.data;
      if (!order) throw new Error('Failed to create order');

      // 2) open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Toonitos Premium',
        description: planType === 1 ? 'Monthly Plan (₹1)' : 'Yearly Plan (₹5)',
        handler: async function (response) {
          try {
            // 3) verify payment on backend (signature checked)
            const verifyRes = await API.post('/payment/verify', {
              ...response,
              planType,
            });

            const updatedUser = verifyRes.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));

            alert('Subscription activated successfully!');
          } catch (err) {
            console.error('verify error', err);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: (JSON.parse(localStorage.getItem('user')) || {}).name,
          email: (JSON.parse(localStorage.getItem('user')) || {}).email,
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('startPayment err', err);
      alert(err?.response?.data?.message || err.message || 'Payment failed');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>

      <div className="space-y-6">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Monthly Plan</h2>
          <p className="mb-3">₹1 / month (test)</p>
          <button onClick={() => startPayment(1)} className="px-4 py-2 bg-blue-600 rounded">Subscribe Monthly</button>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Yearly Plan</h2>
          <p className="mb-3">₹5 / year (test)</p>
          <button onClick={() => startPayment(2)} className="px-4 py-2 bg-green-600 rounded">Subscribe Yearly</button>
        </div>
      </div>
    </div>
  );
}
