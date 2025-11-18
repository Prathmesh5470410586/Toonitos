import React from "react";
import API from "../api";

export default function SubscriptionPage() {

  async function startPayment(planType) {
    try {
      // 1️⃣ Create order
      const orderRes = await API.post("/payment/create-order", { planType });
      const { order } = orderRes.data;

      // 2️⃣ Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Toonitos Premium Membership",
        description: planType === 1 ? "Monthly Plan" : "Yearly Plan",
        handler: async function (response) {
          // 3️⃣ Verify payment
          const verifyRes = await API.post("/payment/verify", {
            ...response,
            planType,
          });

          const updatedUser = verifyRes.data.user;

          // Save
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }));

          alert("Subscription Activated Successfully!");
        },
        theme: { color: "#3399cc" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Choose Your Plan</h1>

      <div className="space-y-6">

        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Monthly Plan</h2>
          <p className="mb-3">₹199 / month</p>
          <button
            onClick={() => startPayment(1)}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Subscribe Monthly
          </button>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Yearly Plan</h2>
          <p className="mb-3">₹999 / year</p>
          <button
            onClick={() => startPayment(2)}
            className="px-4 py-2 bg-green-600 rounded"
          >
            Subscribe Yearly
          </button>
        </div>

      </div>
    </div>
  );
}
