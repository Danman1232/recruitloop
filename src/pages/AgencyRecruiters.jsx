// src/pages/AgencyRecruiters.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import {
  getAgencyRecruiters,
  deleteAgencyRecruiter  // ← import the new helper
} from '../services/api';

export default function AgencyRecruiters() {
  const { user } = useContext(AuthContext);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState('');
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [modalTab, setModalTab] = useState('Profile');
  const [permissions, setPermissions] = useState({
    canAssignJobs: true,
    canDeactivateJobs: false,
  });

  useEffect(() => {
    setLoading(true);
    getAgencyRecruiters(user.agencyId)
      .then(data => {
        const withExtras = data.map(r => ({
          ...r,
          metrics: {
            assignedJobs: r.assignedJobsCount || 0,
            submitted:    r.submissionsCount   || 0,
            interviewing: r.interviewCount     || 0,
            offers:       r.offerCount         || 0,
            placements:   r.placementCount     || 0,
          },
          jobs:        r.jobs        || [],
          submissions: r.submissions || [],
          permissions: r.permissions || {},
        }));
        setRecs(withExtras);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.agencyId]);

  const generateInviteLink = () => {
    const token = Math.random().toString(36).substr(2, 8);
    setInviteLink(
      `${window.location.origin}/signup-recruiter?agencyId=${user.agencyId}&token=${token}`
    );
  };

  const handleManage = recruiter => {
    setSelectedRecruiter(recruiter);
    setModalTab('Profile');
    setPermissions({
      canAssignJobs: recruiter.permissions?.canAssignJobs ?? true,
      canDeactivateJobs: recruiter.permissions?.canDeactivateJobs ?? false
    });
  };

  const closeManage = () => {
    setSelectedRecruiter(null);
  };

  // ← NEW: call DELETE then remove from state
  const handleDeactivate = async () => {
    try {
      await deleteAgencyRecruiter(selectedRecruiter.id);
      setRecs(prev => prev.filter(r => r.id !== selectedRecruiter.id));
      closeManage();
    } catch (err) {
      console.error(err);
      alert('Failed to deactivate recruiter');
    }
  };

  if (loading) {
    return (
      <main className="flex-1 h-screen bg-gray-100 p-8 overflow-y-auto">
        <p>Loading recruiters…</p>
      </main>
    );
  }

  return (
    <>
      {/* Modal */}
      {selectedRecruiter && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '0.5rem',
              width: '90%', maxWidth: '700px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {/* Tabs */}
            <div className="flex border-b mb-4">
              {['Profile', 'Permissions', 'Actions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-4 py-2 -mb-px ${
                    modalTab === tab
                      ? 'border-b-2 border-blue-600 font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {modalTab === 'Profile' && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="font-semibold">
                      {selectedRecruiter.metrics.assignedJobs}
                    </span><br/>
                    Assigned Jobs
                  </div>
                  <div>
                    <span className="font-semibold">
                      {selectedRecruiter.metrics.submitted}
                    </span><br/>
                    Submitted
                  </div>
                  <div>
                    <span className="font-semibold">
                      {selectedRecruiter.metrics.interviewing}
                    </span><br/>
                    Interviewing
                  </div>
                  <div>
                    <span className="font-semibold">
                      {selectedRecruiter.metrics.offers}
                    </span><br/>
                    Offers
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">
                      {selectedRecruiter.metrics.placements}
                    </span><br/>
                    Placements
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-2">Assigned Jobs</h3>
                {selectedRecruiter.jobs.length > 0 ? (
                  <ul className="list-disc pl-5 mb-6 text-sm">
                    {selectedRecruiter.jobs.map(job => (
                      <li key={job.id}>{job.title || job.id}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mb-6">
                    No jobs assigned.
                  </p>
                )}

                <h3 className="text-lg font-medium mb-2">Candidate Pipeline</h3>
                {selectedRecruiter.submissions.length > 0 ? (
                  <div className="overflow-auto max-h-64 mb-4">
                    <table className="w-full text-sm table-auto">
                      <thead className="bg-gray-100">
                        <tr className="text-left">
                          {[
                            'Company','Candidate','Phone','Email',
                            'Position','City','State','Submittal Date','Status'
                          ].map(col => (
                            <th key={col} className="px-2 py-1">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecruiter.submissions.map(sub => (
                          <tr key={sub.id} className="border-t">
                            <td className="px-2 py-1">{sub.company}</td>
                            <td className="px-2 py-1">{sub.candidate}</td>
                            <td className="px-2 py-1">{sub.phone}</td>
                            <td className="px-2 py-1">{sub.email}</td>
                            <td className="px-2 py-1">{sub.position}</td>
                            <td className="px-2 py-1">{sub.city}</td>
                            <td className="px-2 py-1">{sub.state}</td>
                            <td className="px-2 py-1">{sub.date}</td>
                            <td className="px-2 py-1">{sub.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    No candidates submitted.
                  </p>
                )}
              </>
            )}

            {/* Permissions Tab */}
            {modalTab === 'Permissions' && (
              <div className="text-sm mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={permissions.canAssignJobs}
                    onChange={e => setPermissions({
                      ...permissions,
                      canAssignJobs: e.target.checked
                    })}
                    className="mr-2"
                  />
                  Can assign jobs
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.canDeactivateJobs}
                    onChange={e => setPermissions({
                      ...permissions,
                      canDeactivateJobs: e.target.checked
                    })}
                    className="mr-2"
                  />
                  Can deactivate jobs
                </label>
              </div>
            )}

            {/* Actions Tab */}
            {modalTab === 'Actions' && (
              <div className="mb-4">
                <button
                  onClick={handleDeactivate}
                  className="w-full mb-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Deactivate Recruiter
                </button>
                <button
                  onClick={() => console.log('Resetting password for', selectedRecruiter.id)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Reset Password
                </button>
              </div>
            )}

            {/* Close Button */}
            <div className="text-right">
              <button
                onClick={closeManage}
                className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen bg-gray-100 p-8 overflow-y-auto">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Recruiters</h2>
          <button
            onClick={generateInviteLink}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Invite Recruiter
          </button>
        </header>

        {inviteLink && (
          <div className="mb-6 bg-white shadow p-4 rounded flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                alert('Copied!');
              }}
              className="bg-green-600 text-white py-1 px-3 rounded"
            >
              Copy
            </button>
          </div>
        )}

        {recs.length === 0 ? (
          <p>No recruiters found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map(r => (
              <div
                key={r.id}
                className="bg-white p-4 rounded shadow flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    {r.firstName} {r.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{r.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="font-medium">{r.metrics.assignedJobs}</span><br/>
                    Assigned Jobs
                  </div>
                  <div>
                    <span className="font-medium">{r.metrics.submitted}</span><br/>
                    Submitted
                  </div>
                  <div>
                    <span className="font-medium">{r.metrics.interviewing}</span><br/>
                    Interviewing
                  </div>
                  <div>
                    <span className="font-medium">{r.metrics.offers}</span><br/>
                    Offers
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">{r.metrics.placements}</span><br/>
                    Placements
                  </div>
                </div>
                <button
                  onClick={() => handleManage(r)}
                  className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
