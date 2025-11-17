import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <div className="text-gray-900">
      <div className="bg-white rounded-lg p-10 max-w-3xl mx-auto shadow">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to Toonitos</h1>
        <p className="mb-6">Safe, curated cartoon content for kids. Sign in to continue or create a new account.</p>

        <div className="flex gap-4">
          <Link to="/signin" className="px-6 py-3 bg-blue-600 text-white rounded font-medium">Sign In</Link>
          <Link to="/register" className="px-6 py-3 border border-gray-300 rounded text-gray-800 bg-white">Create an Account</Link>
        </div>
      </div>
    </div>
  );
}
