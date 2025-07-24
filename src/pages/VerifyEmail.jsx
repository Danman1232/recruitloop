// src/pages/VerifyEmail.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const navigate = useNavigate();

  function handleContinue() {
    // Simulate “I clicked the link in my email”
    navigate('/onboard/info');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-6">
          We’ve sent a verification link to your email address.<br/>
          Please check your inbox and click the link to continue.
        </p>
        <button
          onClick={handleContinue}
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          I’ve Verified—Continue Setup
        </button>
      </div>
    </div>
  );
}
