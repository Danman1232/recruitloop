// src/pages/JobSearch.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchJobs } from '../services/api';

export default function JobSearch() {
  const [filters, setFilters] = useState({ location:'', function:'', category:'' });
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => { loadJobs() }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const list = await searchJobs(filters);
      setJobs(list);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    loadJobs();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Find Jobs</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          name="location" value={filters.location} onChange={handleChange}
          placeholder="Location" className="p-2 border rounded"
        />
        <input
          name="function" value={filters.function} onChange={handleChange}
          placeholder="Function" className="p-2 border rounded"
        />
        <input
          name="category" value={filters.category} onChange={handleChange}
          placeholder="Category" className="p-2 border rounded"
        />
        <button
          type="submit"
          className="md:col-span-3 bg-[var(--brand-blue)] text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading jobs…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : jobs.length===0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map(job => (
            <li
              key={job.id}
              className="bg-white p-4 rounded shadow flex justify-between hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-600 text-sm">
                  {job.location} — {job.category}
                </p>
              </div>
              <Link
                to={`/jobs/${job.id}`}
                className="text-[var(--brand-blue)] self-center hover:underline"
              >
                Details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
