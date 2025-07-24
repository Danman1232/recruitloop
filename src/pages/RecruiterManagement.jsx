// src/pages/RecruiterManagement.jsx
import React, { useState, useEffect } from 'react';
import { getAgencyRecruiters } from '../services/api';

export default function RecruiterManagement() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState('');

  const agencyDomain = '3phaserecruiting.com';
  const agencyId = '123'; // Replace with dynamic agency ID if available

  useEffect(() => {
    loadRecruiters();
  }, []);

  async function loadRecruiters() {
    setLoading(true);
    try {
      const data = await getAgencyRecruiters(agencyDomain);
      setList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function generateInviteLink() {
    // In real app you'd call backend to create a signed invite link
    const token = Math.random().toString(36).substr(2, 8);
    const link = `${window.location.origin}/signup-recruiter?agencyId=${agencyId}&token=${token}`;
    setInviteLink(link);
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert('Invite link copied to clipboard!');
    });
  }

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Your Recruiters</h2>

      {/* Invite Recruiter Button */}
      <div className="mb-6">
        <button
          onClick={generateInviteLink}
          className="bg-brand-orange text-white py-2 px-4 rounded"
        >
          Invite Recruiter
        </button>
      </div>

      {/* Show invite link if generated */}
      {inviteLink && (
        <div className="mb-6 bg-white shadow p-4 rounded flex items-center gap-2">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Copy
          </button>
        </div>
      )}

      {/* List of recruiters */}
      {loading ? (
        <p>Loading…</p>
      ) : list.length === 0 ? (
        <p>No recruiters yet.</p>
      ) : (
        <ul className="bg-white shadow rounded divide-y">
          {list.map(r => (
            <li key={r.id} className="flex justify-between p-4">
              <span>{r.firstName} {r.lastName} ({r.email})</span>
              <span className="text-gray-500">{r.status || 'Active'}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
