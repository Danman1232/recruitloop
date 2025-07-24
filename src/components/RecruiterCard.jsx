// src/components/RecruiterCard.jsx
import React from 'react';

export default function RecruiterCard({ recruiter, onManage }) {
  // fallback defaults for metrics
  const {
    firstName,
    lastName,
    status = 'Active',
    metrics = {}
  } = recruiter;

  const {
    assignedJobs = 0,
    submitted    = 0,
    interviewing = 0,
    offers       = 0,
    placements   = 0
  } = metrics;

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {firstName} {lastName}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div>
          <span className="font-medium">{assignedJobs}</span><br/>
          Assigned Jobs
        </div>
        <div>
          <span className="font-medium">{submitted}</span><br/>
          Submitted
        </div>
        <div>
          <span className="font-medium">{interviewing}</span><br/>
          Interviewing
        </div>
        <div>
          <span className="font-medium">{offers}</span><br/>
          Offers
        </div>
        <div className="col-span-2">
          <span className="font-medium">{placements}</span><br/>
          Placements
        </div>
      </div>

      <button
        onClick={() => {
          console.log('RecruiterCard ▶ Manage clicked for', recruiter);
          onManage(recruiter);
        }}
        className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Manage
      </button>
    </div>
  );
}
