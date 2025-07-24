// src/pages/Pipeline.jsx
import React, { useState, useEffect }        from 'react';
import { Link, useParams }                   from 'react-router-dom';
import { getPipeline, updateSubmission }     from '../services/api';

const STAGES = [
  { id: 'submitted', label: 'Submitted Resumes' },
  { id: 'accepted',  label: 'Accepted Resumes'  },
  { id: 'interviews', label: 'Interviews', children: [
      { id: 'phone', label: 'Phone Screen'       },
      { id: 'onsite',label: 'On-Site Interview' }
    ]
  },
  { id: 'offers', label: 'Offers', children: [
      { id: 'sent',    label: 'Offer Sent'      },
      { id: 'approved',label: 'Offer Accepted' }
    ]
  },
  { id: 'placed', label: 'Placed Candidates', children: [
      { id: 'pending',   label: 'Pending'       },
      { id: 'confirmed', label: 'Confirmed'     }
    ]
  },
];

export default function Pipeline() {
  const { jobId } = useParams();

  const [stage, setStage]       = useState('submitted');
  const [subs, setSubs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({
    phone: true,
    onsite: true,
    sent: true,
    approved: true,
    pending: true,
    confirmed: true
  });

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

  let displaySubs = [];
  if (stage === 'submitted') {
    displaySubs = subs.filter(s => !s.status);
  } else if (stage === 'accepted') {
    displaySubs = subs.filter(s => s.status === 'accepted');
  } else if (stage === 'interviews') {
    displaySubs = subs.filter(s =>
      (filters.phone   && s.interviewStage === 'phone') ||
      (filters.onsite  && s.interviewStage === 'onsite')
    );
  } else if (stage === 'offers') {
    displaySubs = subs.filter(s =>
      (filters.sent     && s.offerStage === 'sent')    ||
      (filters.approved && s.offerStage === 'approved')
    );
  } else if (stage === 'placed') {
    displaySubs = subs.filter(s =>
      (filters.pending    && s.placementStage === 'pending')   ||
      (filters.confirmed  && s.placementStage === 'confirmed')
    );
  }

  async function handleAction(id, action) {
    await updateSubmission(id, { status: action });
    setSubs(subs.map(s => s.id === id ? { ...s, status: action } : s));
  }

  return (
    <div className="h-screen flex">
      {/* ── Sub-Sidebar ── */}
      <nav className="w-64 bg-white p-6 border-r">
        {STAGES.map(st => (
          <div key={st.id} className="mb-6">
            <button
              onClick={() => setStage(st.id)}
              className={`flex items-center w-full py-2 text-left ${
                stage === st.id
                  ? 'text-brand-blue font-semibold'
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              <span className="inline-block w-6 h-6 mr-2 flex items-center justify-center rounded-full bg-brand-blue text-white">
                {STAGES.findIndex(x => x.id === st.id) + 1}
              </span>
              {st.label}
            </button>

            {st.children && (
              <div className="ml-8 mt-2 space-y-2">
                {st.children.map(ch => (
                  <label key={ch.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters[ch.id]}
                      onChange={() =>
                        setFilters(f => ({ ...f, [ch.id]: !f[ch.id] }))
                      }
                    />
                    <span className={
                      filters[ch.id]
                        ? 'text-brand-blue font-medium'
                        : 'text-gray-500'
                    }>
                      {ch.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Main Content ── */}
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
                <th className="p-4">Actions</th>
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
                  <td className="p-4 space-x-2 text-center">
                    <Link
                      to={`/jobs/${jobId}/candidates/${s.id}/resume`}
                      className="text-blue-600 hover:underline"
                    >
                      📄 View
                    </Link>

                    {stage === 'submitted' && (
                      <>
                        <button
                          onClick={() => handleAction(s.id, 'accepted')}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(s.id, 'declined')}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {stage === 'accepted' && (
                      <button className="bg-orange-500 text-white px-2 py-1 rounded">
                        Request Interview
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
