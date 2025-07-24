// src/pages/PaymentBank.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { addBankAccount } from '../services/api'; // your real API helper

export default function PaymentBank() {
  const [bankName, setBankName]           = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError]                 = useState('');
  const navigate                          = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      // TODO: await addBankAccount({ bankName, routingNumber, accountNumber });
      navigate('/first-job', { replace: true });
    } catch (err) {
      setError(err.message || 'Bank link failed');
    }
  }

  function handleCardInstead() {
    navigate('/signup/company/payment/credit');
  }

  function handleSkip() {
    navigate('/first-job', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Link a Bank Account
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              placeholder="e.g. Bank of America"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Routing Number</label>
            <input
              type="text"
              value={routingNumber}
              onChange={e => setRoutingNumber(e.target.value)}
              placeholder="012345678"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="1234567890"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save &amp; Finish
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <button
            onClick={handleCardInstead}
            className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Add a Credit Card Instead
          </button>
          <button
            onClick={handleSkip}
            className="block w-full text-sm text-gray-600 hover:underline"
          >
            Skip and Add Later
          </button>
        </div>
      </div>
    </div>
  );
}
