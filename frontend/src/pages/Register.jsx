import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // 1) Create account
      await API.post("/auth/register", { name, email, password });

      // 2) Auto-login: call login endpoint to get token
      const loginRes = await API.post("/auth/login", { email, password });
      const { token } = loginRes.data;

      if (!token) throw new Error("No token after register/login");

      // 3) save token
      localStorage.setItem("token", token);

      // 4) fetch fresh user
      const meRes = await API.get("/user/me");
      const freshUser = meRes.data;

      // 5) save user and notify
      localStorage.setItem("user", JSON.stringify(freshUser));
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: freshUser }));

      // 6) redirect to browse
      navigate("/browse");
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-8 text-gray-900 shadow">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" type="text" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full border px-3 py-2 rounded" type="password" />
        </div>

        <div>
          <button disabled={loading} type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? "Creating..." : "Create account"}
          </button>
        </div>

        <div className="text-sm mt-2">
          Already have an account? <Link to="/signin" className="text-blue-600">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
