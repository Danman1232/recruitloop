import React from 'react';

export default function Unauthorized() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">403 — Unauthorized</h1>
      <p className="mt-4 text-gray-700">You don’t have access to that page.</p>
    </div>
  );
}
