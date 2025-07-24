// src/pages/SignupRecruiter.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { inviteRecruiter, signupRecruiter } from '../services/api';

export default function SignupRecruiter() {
  const [params] = useSearchParams();
  const agencyId = params.get('agencyId');
  const token    = params.get('token');  // optional server validation
  const navigate = useNavigate();

  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error,       setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    try {
      // 1) Create the agencyRecruiter record for admin view
      await inviteRecruiter({
        firstName,
        lastName,
        email,
        agencyId,
        status: 'Active',
        inviteToken: token
      });

      // 2) Register them as a login-able user
      await signupRecruiter({
        email,
        password,
        agencyId,
        firstName,
        lastName
      });

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to complete sign up');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Your Recruiter Sign-Up
        </h2>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <label className="block mb-2 font-medium">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          required
        />

        <label className="block mb-2 font-medium">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          required
        />

        <label className="block mb-2 font-medium">Company Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          required
        />

        <label className="block mb-2 font-medium">Create Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          minLength={8}
          required
        />

        <label className="block mb-2 font-medium">Verify Password</label>
        <input
          type="password"
          value={confirmPass}
          onChange={e => setConfirmPass(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-6"
          minLength={8}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
