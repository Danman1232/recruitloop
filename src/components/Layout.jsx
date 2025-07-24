// src/components/Layout.jsx
import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const navigate         = useNavigate();
  const role             = user?.role;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="h-screen flex">
      {/* ─── SIDEBAR ───────────────────────────────────────────── */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">RecruitLoop</h1>
        <nav className="space-y-4 text-sm">
          {role === 'company' && (
            <>
              <Link to="/dashboard"             className="block hover:bg-gray-700 px-3 py-2 rounded">
                Dashboard
              </Link>
              <Link to="/dashboard/submissions" className="block hover:bg-gray-700 px-3 py-2 rounded">
                Submissions
              </Link>
              <Link to="/dashboard/jobs"        className="block hover:bg-gray-700 px-3 py-2 rounded">
                My Jobs
              </Link>
            </>
          )}

          {role === 'agency_admin' && (
            <>
              <Link to="/agency"                className="block hover:bg-gray-700 px-3 py-2 rounded">
                Agency Dashboard
              </Link>
              <Link to="/agency/recruiters"     className="block hover:bg-gray-700 px-3 py-2 rounded">
                Recruiters
              </Link>
              <Link to="/agency/jobs"           className="block hover:bg-gray-700 px-3 py-2 rounded">
                Agency Jobs
              </Link>
              <Link to="/agency/submissions"    className="block hover:bg-gray-700 px-3 py-2 rounded">
                Submissions
              </Link>
              <Link to="/marketplace"           className="block hover:bg-gray-700 px-3 py-2 rounded">
                All Jobs
              </Link>
            </>
          )}

          {role === 'agency_recruiter' && (
            <>
              <Link to="/agency/jobs"         className="block hover:bg-gray-700 px-3 py-2 rounded">
                Jobs
              </Link>
              <Link to="/agency/submissions"  className="block hover:bg-gray-700 px-3 py-2 rounded">
                Submissions
              </Link>
              <Link to="/marketplace"         className="block hover:bg-gray-700 px-3 py-2 rounded">
                All Jobs
              </Link>
            </>
          )}

          {role === 'looper' && (
            <>
              <Link to="/jobs"                className="block hover:bg-gray-700 px-3 py-2 rounded">
                Find Jobs
              </Link>
              <Link to="/submissions"         className="block hover:bg-gray-700 px-3 py-2 rounded">
                Submissions
              </Link>
              <Link to="/marketplace"         className="block hover:bg-gray-700 px-3 py-2 rounded">
                All Jobs
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <header className="flex justify-end items-center mb-6 space-x-4">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Log out
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
