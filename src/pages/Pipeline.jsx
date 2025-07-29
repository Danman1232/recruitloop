// src/pages/Pipeline.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPipeline, updateSubmission } from '../services/api';
import { getStageColor, formatStageLabel } from '../utils/stageHelpers';

const STAGES = [
  { id: 'pending', label: 'Submissions' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'phone_interview', label: 'Phone Interview' },
  { id: 'in_person', label: 'In Person Interview' },
  { id: 'offer_sent', label: 'Offer Sent' },
  { id: 'offer_accepted', label: 'Offer Accepted' },
  { id: 'placed', label: 'Placed' },
  { id: 'declined', label: 'Declined' },
];

export default function Pipeline() {
  const { jobId } = useParams();
  const [stage, setStage] = useState('pending');
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getPipeline(jobId);
        setSubs(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobId]);

  const displaySubs = subs.filter((s) => s.stage === stage);

  async function handleAction(id, stage, status) {
    await updateSubmission(id, { stage, status });
    setSubs(subs.map(s => s.id === id ? { ...s, stage, status } : s));
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <nav className="w-64 bg-white p-6 border-r">
        {STAGES.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => setStage(st.id)}
            className={`flex items-center w-full py-2 text-left mb-3 ${
              stage === st.id
                ? 'text-brand-blue font-semibold'
                : 'text-gray-700 hover:text-brand-blue'
            }`}
          >
            <span className={`inline-block w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-brand-blue text-white`}>
              {idx + 1}
            </span>
            {st.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Job {jobId} — {STAGES.find(s => s.id === stage)?.label}
          </h2>
        </header>

        {loading ? (
          <p>Loading candidates…</p>
        ) : (
          <table className="min-w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12">Select</th>
                <th className="p-4 text-left">Looper</th>
                <th className="p-4 text-left">Candidate</th>
                <th className="p-4 text-left">Stage</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {displaySubs.map(s => (
                <tr key={s.id}>
                  <td className="p-4 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-4">{s.looper}</td>
                  <td className="p-4">{s.name}</td>
                  <td className="p-4">
                    <span className={`text-white px-2 py-1 rounded text-sm ${getStageColor(s.stage)}`}>
                      {formatStageLabel(s.stage)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{s.status}</td>
                  <td className="p-4 space-x-2 text-center">
                    <Link
                      to={`/jobs/${jobId}/candidates/${s.id}/resume`}
                      className="text-blue-600 hover:underline"
                    >
                      📄 View
                    </Link>

                    {stage === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(s.id, 'accepted', 'Pending Phone Interview')}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(s.id, 'declined', 'Candidate Declined')}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {stage === 'accepted' && (
                      <button
                        onClick={() => {
                          const date = prompt("Enter phone interview date (e.g., Aug 2)");
                          if (date)
                            handleAction(s.id, 'phone_interview', `Phone Screen ${date}`);
                        }}
                        className="bg-orange-500 text-white px-2 py-1 rounded"
                      >
                        Schedule Phone Screen
                      </button>
                    )}

                    {stage === 'phone_interview' && (
                      <button
                        onClick={() => {
                          const date = prompt("Enter in-person interview date:");
                          if (date)
                            handleAction(s.id, 'in_person', `In Person ${date}`);
                        }}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Schedule In Person
                      </button>
                    )}

                    {stage === 'in_person' && (
                      <button
                        onClick={() => handleAction(s.id, 'offer_sent', 'Offer Sent')}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Send Offer
                      </button>
                    )}

                    {stage === 'offer_sent' && (
                      <button
                        onClick={() => {
                          const date = prompt("Enter start date:");
                          if (date)
                            handleAction(s.id, 'offer_accepted', `Offer Accepted - Starting ${date}`);
                        }}
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Mark Offer Accepted
                      </button>
                    )}

                    {stage === 'offer_accepted' && (
                      <button
                        onClick={() => {
                          const date = prompt("Enter actual start date:");
                          if (date)
                            handleAction(s.id, 'placed', `Started ${date}`);
                        }}
                        className="bg-indigo-600 text-white px-2 py-1 rounded"
                      >
                        Mark as Started
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
