import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Browse from './pages/Browse';

// NEW subscription pages
import SubscriptionPage from './pages/SubscriptionPage';
import CancelSubscriptionPage from './pages/CancelSubscription';

import API from './api';

function Header() {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // ---------------- REAL-TIME USER UPDATE LISTENERS ----------------
  useEffect(() => {
    // triggered when localStorage changes in other tabs
    function onStorage(e) {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    }

    // triggered when we manually dispatch an update
    function onUserUpdated(e) {
      const u = e.detail;
      setUser(u);
    }

    window.addEventListener('storage', onStorage);
    window.addEventListener('userUpdated', onUserUpdated);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('userUpdated', onUserUpdated);
    };
  }, []);

  // ---------------- SUBSCRIBE ----------------
  async function handleUpgrade() {
    navigate('/subscribe');
  }

  // ---------------- CANCEL ----------------
  async function handleCancel() {
    navigate('/cancel');
  }

  // ---------------- LOGOUT ----------------
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.dispatchEvent(new CustomEvent('userUpdated', { detail: null }));

    setUser(null);
    navigate('/');
  }

  // Display subscription name
  function getSubName() {
    if (!user || user.subscription === 0) return "Free";
    if (user.subscription === 1) return "Monthly";
    if (user.subscription === 2) return "Yearly";
    return "Free";
  }

  return (
    <header className="p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold">Toonitos</Link>

        <nav className="space-x-4 flex items-center">

          <Link to="/browse" className="px-3 py-1 rounded hover:bg-gray-800">
            Browse
          </Link>

          {!user && (
            <>
              <Link to="/signin" className="px-3 py-1 rounded hover:bg-gray-800">
                Sign In
              </Link>

              <Link to="/register" className="px-3 py-1 rounded hover:bg-gray-800">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <div className="px-3 py-1 rounded text-sm">
                Hi, {user.name || user.email}
              </div>

              <div className="px-3 py-1 rounded text-sm">
                Status: {getSubName()}
              </div>

              {user.subscription === 0 ? (
                <button
                  onClick={handleUpgrade}
                  className="ml-2 px-3 py-1 bg-yellow-500 text-black rounded"
                >
                  Upgrade
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="ml-2 px-3 py-1 bg-gray-700 rounded"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-red-600 rounded"
              >
                Logout
              </button>
            </>
          )}

        </nav>

      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />

          {/* NEW ROUTES */}
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/cancel" element={<CancelSubscriptionPage />} />
        </Routes>
      </main>
    </div>
  );
}
