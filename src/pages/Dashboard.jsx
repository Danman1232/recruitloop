// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSubmissions } from '../services/api';
import JobsTable from '../components/JobsTable';

export default function Dashboard() {
  // State for submissions awaiting response
  const [pending, setPending] = useState([]);
  const [loadingPend, setLoadingPend] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await getAllSubmissions();
        // filter out those already accepted or declined
        const needs = all.filter(
          s => s.status !== 'accepted' && s.status !== 'declined'
        );
        setPending(needs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPend(false);
      }
    })();
  }, []);

  return (
    <main className="flex-1 h-screen bg-gray-100 p-8 overflow-y-auto">
      {/* Page Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
      </header>

      {/* Pending Response Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Pending Response</h3>
        {loadingPend ? (
          <p>Loading…</p>
        ) : pending.length === 0 ? (
          <p className="text-gray-500">No submissions awaiting response.</p>
        ) : (
          <ul className="space-y-4">
            {pending.map(sub => (
              <li
                key={sub.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{sub.name}</p>
                  <p className="text-sm text-gray-500">
                    By: {sub.looper} &bull; Job ID {sub.jobId}
                  </p>
                </div>
                <Link
                  to={`/jobs/${sub.jobId}/pipeline`}
                  className="text-blue-600 hover:underline"
                >
                  View Pipeline
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Active Jobs Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">Active Jobs</h3>
        {/* Only shows “Active” jobs; the tab bar is hidden when there’s just one stage */}
        <JobsTable allowedStages={['in-progress']} />
      </section>
    </main>
  );
}
