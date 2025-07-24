// src/components/LooperLayout.jsx
import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function LooperLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">RecruitLoop</h1>
        <nav className="space-y-4 text-sm">
          <Link
            to="/looper/dashboard"
            className="block hover:bg-gray-700 px-3 py-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/looper/dashboard/submissions"
            className="block hover:bg-gray-700 px-3 py-2 rounded"
          >
            Submissions
          </Link>
          <Link
            to="/looper/dashboard/jobs"
            className="block hover:bg-gray-700 px-3 py-2 rounded"
          >
            Jobs
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <header className="flex justify-end items-center mb-6 space-x-4">
          <span className="text-gray-600">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Log out
          </button>
        </header>
        {/* wherever you render your looper pages */}
        <Outlet />
      </main>
    </div>
  );
}
