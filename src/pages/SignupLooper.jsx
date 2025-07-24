// src/pages/SignupLooper.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupRecruiter } from '../services/api'; // or make a `signupLooper` helper

export default function SignupLooper() {
  const [firstName, setFirst]   = useState('');
  const [lastName, setLast]     = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords must match');
      return;
    }
    try {
      // reuse signupRecruiter to create looper user with role "looper"
      await signupRecruiter({ 
        email, 
        password, 
        role: 'looper', 
        firstName, 
        lastName 
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Sign-up failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Looper Sign-Up</h2>
        {error && <p className="text-red-600">{error}</p>}

        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirst(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLast(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          required
          className="w-full border p-2 rounded"
        />

        <label>Verify Password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          minLength={8}
          required
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
          Create Looper Account
        </button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
);
}
