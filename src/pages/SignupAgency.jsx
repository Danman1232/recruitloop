// src/pages/SignupAgency.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAgency, signupAgencyAdmin } from '../services/api';

export default function SignupAgency() {
  const [name, setName]         = useState('');
  const [domain, setDomain]     = useState('');
  const [website, setWebsite]   = useState('');
  const [firstName, setFirst]   = useState('');
  const [lastName,  setLast]    = useState('');
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
      // 1) Create agency
      const agency = await createAgency({ name, domain, website });
      // 2) Create its admin user
      await signupAgencyAdmin({
        email,
        password,
        agencyId: agency.id,
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-center">Agency Sign-Up</h2>
        {error && <p className="text-red-600">{error}</p>}

        <label>Agency Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <label>Agency Domain</label>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          required
          className="w-full border p-2 rounded"
        />

        <label>Website (optional)</label>
        <input
          type="url"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <hr />

        <label>Admin First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirst(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <label>Admin Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLast(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <label>Admin Email</label>
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

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Create Agency Account
        </button>
      </form>
    </div>
  );
}
