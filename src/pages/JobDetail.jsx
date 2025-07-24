// src/pages/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }       from 'react-router-dom';
import { getJob }                        from '../services/api';

export default function JobDetail() {
  const { jobId }  = useParams();
  const navigate   = useNavigate();
  const [job, setJob]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function load() {
      try {
        setJob(await getJob(jobId));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobId]);

  if (loading) return <p>Loading job…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;
  if (!job)    return <p>Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-6">
        {job.location} • {job.category}
      </p>
      <div className="prose mb-8">
        <h3>Description</h3>
        <p>{job.description}</p>
      </div>
      <button
        onClick={() => navigate(`/jobs/${jobId}/submit`)}
        className="bg-[var(--brand-blue)] text-white px-5 py-2 rounded"
      >
        Submit Candidate
      </button>
    </div>
  );
}
