import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EINVerificationPending() {
  const navigate = useNavigate();

  function handleContinue() {
    // Default now goes to the bank‐linking page
    navigate('/onboard/payment/bank');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Thanks for Your Submission!</h2>
        <p className="mb-6 text-gray-700">
          We’re verifying your company’s EIN and details now.<br/>
          You should receive a confirmation email within 24–48 hours once validation completes.
        </p>
        <button
          onClick={handleContinue}
          className="inline-block bg-[var(--brand-blue)] text-white px-5 py-2 rounded hover:bg-blue-600"
        >
          Link a Bank Account
        </button>
      </div>
    </div>
  );
}
