// src/pages/PaymentCredit.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCredit() {
  const [credit, setCredit] = useState({
    name: '',
    card: '',
    exp: '',
    cvc: '',
    zip: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setCredit(c => ({ ...c, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // (optional) Add your validation here

    // On success, go to FirstJob page
    navigate('/first-job');
  }

  function handleSkip() {
    navigate('/first-job');
  }

  function handleBankInstead() {
    navigate('/onboard/payment/bank');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add a Credit Card
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={credit.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Card Number</label>
            <input
              type="text"
              name="card"
              value={credit.card}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">Exp. Date</label>
              <input
                type="text"
                name="exp"
                value={credit.exp}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">CVC</label>
              <input
                type="text"
                name="cvc"
                value={credit.cvc}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">ZIP</label>
              <input
                type="text"
                name="zip"
                value={credit.zip}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* MAIN ACTION BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save & Finish
          </button>
        </form>

        {/* SECONDARY BUTTONS */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleSkip}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            type="button"
          >
            Skip and Add Later
          </button>
          <button
            onClick={handleBankInstead}
            className="w-full bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            type="button"
          >
            Add a Bank Account Instead
          </button>
        </div>
      </div>
    </div>
  );
}
