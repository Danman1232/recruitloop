// src/pages/LooperSubmissions.jsx
import React, { useState, useEffect } from 'react';
import { getAllSubmissions, updateSubmission } from '../services/api';

const STAGES = [
  { label: 'All',                value: 'all',             level: 0 },
  { label: 'Submitted',          value: 'submitted',       level: 0 },
  { label: 'Accepted',           value: 'accepted',        level: 0 },
  { label: 'Interview',          value: 'interview',       level: 0 },
  { label: 'Phone Interview',    value: 'interview_phone', level: 1 },
  { label: 'In-Person Interview',value: 'interview_onsite',level: 1 },
  { label: 'Offer',              value: 'offer',           level: 0 },
  { label: 'Offer Sent',         value: 'offer_sent',      level: 1 },
  { label: 'Offer Accepted',     value: 'offer_accepted',  level: 1 },
  { label: 'Placed',             value: 'placed',          level: 0 },
  { label: 'Declined',           value: 'declined',        level: 0 },
];

export default function LooperSubmissions() {
  const [subs, setSubs]       = useState([]);
  const [stage, setStage]     = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllSubmissions();
        setSubs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filter by selected stage
  const displayed = stage === 'all'
    ? subs.filter(s => s.status !== 'declined')  // or whatever “all” means
    : subs.filter(s => {
        if (stage === 'interview') {
          return s.status.startsWith('interview');
        }
        if (stage === 'offer') {
          return s.status.startsWith('offer');
        }
        return s.status === stage;
      });

  // helper to update status
  const changeStatus = async (id, newStatus) => {
    setSubs(ss => ss.map(s => s.id === id ? { ...s, status: newStatus } : s));
    try {
      await updateSubmission(id, { status: newStatus });
    } catch (e) {
      console.error('Failed to update submission', e);
    }
  };

  return (
    <main className="flex-1 h-screen bg-gray-100 p-8 overflow-y-auto">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <header className="mb-6">
        <h2 className="text-3xl font-bold">Submissions</h2>
      </header>

      <div className="flex">
        {/* ─── Sub-Sidebar ──────────────────────────────────────── */}
        <nav className="w-48 bg-white rounded shadow p-4 mr-6">
          <h3 className="text-lg font-semibold mb-3">Stages</h3>
          <ul className="space-y-1">
            {STAGES.map(({ label, value, level }) => (
              <li
                key={value}
                onClick={() => setStage(value)}
                className={`
                  cursor-pointer
                  ${stage === value
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'}
                  ${level > 0 ? 'pl-6' : ''}
                `}
              >
                {label}
              </li>
            ))}
          </ul>
        </nav>

        {/* ─── Main Table ───────────────────────────────────────── */}
        <div className="flex-1">
          {loading ? (
            <p>Loading submissions…</p>
          ) : displayed.length === 0 ? (
            <p className="text-gray-500">No submissions in this stage.</p>
          ) : (
            <table className="w-full bg-white rounded shadow overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Looper</th>
                  <th className="px-4 py-2 text-left">Candidate</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Submitted</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayed.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{s.looper}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">{s.jobTitle}</td>
                    <td className="px-4 py-2">{s.location}</td>
                    <td className="px-4 py-2">
                      {new Date(s.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{s.status}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      {/* example buttons */}
                      {s.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => changeStatus(s.id, 'accepted')}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => changeStatus(s.id, 'declined')}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {/* add other status‐based actions here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
