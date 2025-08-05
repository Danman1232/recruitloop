// src/pages/CompanySubmissions.jsx

import React, { useState, useEffect } from 'react';
import { getAllSubmissions, updateSubmission } from '../services/api';
import { getStageColor, formatStageLabel } from '../utils/stageHelpers';

const STAGES = [
  { label: 'Submitted', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { header: 'Interview' },
  { label: 'Phone Interview', value: 'phone_interview', indent: true },
  { label: 'In-Person Interview', value: 'in_person', indent: true },
  { header: 'Offer' },
  { label: 'Offer Sent', value: 'offer_sent', indent: true },
  { label: 'Offer Accepted', value: 'offer_accepted', indent: true },
  { label: 'Placed', value: 'placed' },
  { label: 'Declined', value: 'declined' },
];

export default function CompanySubmissions() {
  const [subs, setSubs] = useState([]);
  const [stage, setStage] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setSubs(await getAllSubmissions());
      } catch {
        console.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function patch(id, updates) {
    setSubs(s => s.map(x => x.id === id ? { ...x, ...updates } : x));
    try {
      await updateSubmission(id, updates);
    } catch {
      console.error('Failed to update submission');
    }
  }

  const rows = subs.filter(s => (s.stage || s.status) === stage);

  // Dynamic column header
  const dateHeader =
    stage === 'offer_sent' ||
    stage === 'offer_accepted' ||
    stage === 'placed'
      ? 'Start Date'
      : 'Interview Date';

  return (
    <main className="flex-1 flex h-screen bg-gray-100 overflow-hidden">
      <nav className="w-56 bg-white border-r h-full">
        <div className="px-4 pt-4">
          <h3 className="text-gray-500 text-sm uppercase mb-2">Stages</h3>
          {STAGES.map((item, i) =>
            item.header ? (
              <p
                key={i}
                className="mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase"
              >
                {item.header}
              </p>
            ) : (
              <div
                key={item.value}
                onClick={() => setStage(item.value)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  stage === item.value
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${item.indent ? 'ml-4' : ''}`}
              >
                {item.label}
              </div>
            )
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-3xl font-bold">Submissions</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <p>Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-gray-500">No submissions in this stage.</p>
          ) : (
            <table className="min-w-full bg-white rounded shadow overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Looper</th>
                  <th className="px-4 py-2 text-left">Candidate</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Submitted</th>
                  <th className="px-4 py-2 text-left">Stage</th>
                  <th className="px-4 py-2 text-center">{dateHeader}</th>
                  <th className="px-4 py-2 text-center">Resume</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{s.looper}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">{s.jobTitle}</td>
                    <td className="px-4 py-2">{s.location}</td>
                    <td className="px-4 py-2">
                      {new Date(s.submissionDate || s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-white px-2 py-1 rounded text-sm ${
                          getStageColor(s.stage || s.status)
                        }`}
                      >
                        {formatStageLabel(s.stage || s.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {(s.status === 'phone_interview' ||
                        s.status === 'in_person' ||
                        s.status === 'offer_sent' ||
                        s.status === 'offer_accepted' ||
                        s.status === 'placed') && (
                        <button
                          onClick={() => { /* placeholder for schedule modal */ }}
                          className="bg-orange-500 text-white px-2 py-1 rounded"
                        >
                          Schedule
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {s.resumeUrl ? (
                        <button
                          onClick={() => setSelected(s)}
                          className="text-gray-600 hover:text-gray-900 text-xl"
                        >
                          📄
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      {(s.status === 'submitted' || s.status === 'pending') && (
                        <>
                          <button
                            onClick={() => patch(s.id, { status: 'accepted' })}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              const fb = prompt('Please provide feedback:');
                              if (fb !== null) patch(s.id, { status: 'declined', feedback: fb });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {s.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => patch(s.id, { status: 'phone_interview' })}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Advance
                          </button>
                          <button
                            onClick={() => {
                              const fb = prompt('Please provide feedback:');
                              if (fb !== null) patch(s.id, { status: 'declined', feedback: fb });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {s.status === 'phone_interview' && (
                        <>
                          <button
                            onClick={() => patch(s.id, { status: 'in_person' })}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Advance
                          </button>
                          <button
                            onClick={() => {
                              const fb = prompt('Please provide feedback:');
                              if (fb !== null) patch(s.id, { status: 'declined', feedback: fb });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {s.status === 'in_person' && (
                        <>
                          <button
                            onClick={() => patch(s.id, { status: 'offer_sent' })}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Advance
                          </button>
                          <button
                            onClick={() => {
                              const fb = prompt('Please provide feedback:');
                              if (fb !== null) patch(s.id, { status: 'declined', feedback: fb });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {s.status === 'offer_sent' && (
                        <>
                          <button
                            onClick={() => patch(s.id, { status: 'offer_accepted' })}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Accept Offer
                          </button>
                          <button
                            onClick={() => {
                              const fb = prompt('Please provide feedback:');
                              if (fb !== null) patch(s.id, { status: 'declined', feedback: fb });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {s.status === 'offer_accepted' && (
                        <>
                          <button
                            onClick={() => patch(s.id, { status: 'placed' })}
                            className="bg-green-500 text-white px-2 py-1 rounded"
                          >
                            Confirm Start
                          </button>
                          <button
                            onClick={() => {
                              const fb = prompt('Please provide feedback:');
                              if (fb !== null) patch(s.id, { status: 'declined', feedback: fb });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {s.status === 'placed' && (
                        <button
                          onClick={() => patch(s.id, { status: 'declined', feedback: '' })}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      )}

                      {s.status === 'declined' && (
                        <button
                          onClick={() => patch(s.id, { status: 'submitted', feedback: '' })}
                          className="bg-orange-500 text-white px-2 py-1 rounded"
                        >
                          Reassign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-bold">{selected.name} Candidate Submittal</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-600 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-[75vh] overflow-auto">
              <object
                data={selected.resumeUrl}
                type="application/pdf"
                width="100%"
                height="100%"
              >
                <p className="p-4">
                  Your browser doesn’t support embedded PDFs.<br />
                  <a
                    href={selected.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download PDF
                  </a>
                </p>
              </object>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-4">
              <button
                onClick={() => {
                  patch(selected.id, { status: 'accepted' });
                  setSelected(null);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  const fb = prompt('Please provide feedback:');
                  if (fb !== null) {
                    patch(selected.id, { status: 'declined', feedback: fb });
                    setSelected(null);
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  const email = prompt('Enter email to share resume:');
                  if (email) alert(`Shared with ${email}!`);
                }}
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
