import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import SubscriptionPage from "./pages/SubscriptionPage";
import CancelSubscriptionPage from "./pages/CancelSubscriptionPage";

import API from "./api";

function Header() {
  // read initial user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // keep header in sync with localStorage and same-tab events
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    }

    function onUserUpdated(e) {
      // e.detail may be null (logout) or user object
      try {
        const detail = e?.detail ?? null;
        if (detail !== null) setUser(detail);
        else {
          const s = localStorage.getItem("user");
          setUser(s ? JSON.parse(s) : null);
        }
      } catch {
        setUser(null);
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("userUpdated", onUserUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userUpdated", onUserUpdated);
    };
  }, []);

  // normalize subscription to integer (treat undefined/null as 0)
  const sub = (() => {
    try {
      if (!user) return 0;
      const s = user.subscription;
      if (s === null || s === undefined || s === "") return 0;
      const n = Number(s);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  })();

  function getSubName() {
    if (sub === 0) return "Free";
    if (sub === 1) return "Monthly";
    if (sub === 2) return "Yearly";
    return "Free";
  }

  // navigate to subscription page (we handle checkout there)
  function handleUpgrade() {
    navigate("/subscribe");
  }

  function handleCancel() {
    navigate("/cancel");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // notify same-tab listeners
    window.dispatchEvent(new CustomEvent("userUpdated", { detail: null }));

    setUser(null);
    navigate("/");
  }

  return (
    <header className="p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Toonitos
        </Link>

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
              <div className="px-3 py-1 rounded text-sm">Hi, {user.name || user.email}</div>

              <div className="px-3 py-1 rounded text-sm">Status: {getSubName()}</div>

              {sub === 0 ? (
                <button
                  onClick={handleUpgrade}
                  className="ml-2 px-3 py-1 bg-yellow-500 text-black rounded"
                >
                  Upgrade
                </button>
              ) : (
                <button onClick={handleCancel} className="ml-2 px-3 py-1 bg-gray-700 rounded">
                  Cancel
                </button>
              )}

              <button onClick={handleLogout} className="ml-2 px-3 py-1 bg-red-600 rounded">
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
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/cancel" element={<CancelSubscriptionPage />} />
        </Routes>
      </main>
    </div>
  );
}
