// src/pages/SignUpChoice.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUpChoice() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-6">
      <h1 className="text-3xl font-bold">Sign up as</h1>
      <div className="space-x-4">
        <button
          onClick={() => nav('/signup/company')}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Company
        </button>
        <button
          onClick={() => nav('/signup/agency')}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
        >
          Agency
        </button>
        <button
          onClick={() => nav('/signup/looper')}
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700"
        >
          Looper
        </button>
      </div>
    </div>
  );
}
