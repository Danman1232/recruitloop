// src/pages/CompanyOnboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompany } from '../services/api';

export default function CompanyOnboarding() {
  const [company, setCompany] = useState({
    name: '',
    ein: '',
    website: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await createCompany(company);
      // corrected path: must match App.js route for payment credit
      navigate('/onboard/payment/credit', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Tell us about your company
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Company Name</label>
            <input
              type="text"
              value={company.name}
              onChange={e => setCompany({ ...company, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">EIN / Tax ID</label>
            <input
              type="text"
              value={company.ein}
              onChange={e => setCompany({ ...company, ein: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Website</label>
            <input
              type="url"
              value={company.website}
              onChange={e => setCompany({ ...company, website: e.target.value })}
              placeholder="https://example.com"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
