import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;

      // Save token + user (user includes subscription)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to browse
      navigate('/browse');
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-8 text-gray-900 shadow">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required
            className="w-full border px-3 py-2 rounded" type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} required
            className="w-full border px-3 py-2 rounded" type="password" />
        </div>
        <div className="flex items-center justify-between">
          <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <Link to="/register" className="text-sm text-blue-600">Create account</Link>
        </div>
      </form>
    </div>
  );
}
