// src/pages/CompanyJobs.jsx
import React, { useState, useEffect } from 'react'
import { getJobs } from '../services/api'
import { Link }    from 'react-router-dom'

export default function CompanyJobs() {
  const [jobs, setJobs]       = useState([])
  const [filter, setFilter]   = useState('in-progress')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const all = await getJobs()
        setJobs(all)
      } catch (err) {
        console.error(err)
        setError('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = [
    { label: 'Active', value: 'in-progress' },
    { label: 'Open',   value: 'hiring'      },
    { label: 'Closed', value: 'past'        },
    { label: 'Drafts', value: 'draft'       },
  ]

  const filtered = jobs.filter(job => job.stage === filter)

  if (loading) return <p className="p-8">Loading jobs…</p>
  if (error)   return <p className="p-8 text-red-600">{error}</p>

  return (
    <div className="p-8">
      {/* ─── TABS + NEW JOB BUTTON IN ONE ROW ───────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        {/* Stage Tabs */}
        <div className="flex space-x-4">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded ${
                filter === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* New Job Button */}
        <Link to="/jobs/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            New Job
          </button>
        </Link>
      </div>

      {/* ─── JOBS TABLE ─────────────────────────────────────────────── */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Job Title</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Pay Rate</th>
              <th className="p-3 text-left">Openings</th>
              <th className="p-3 text-left">Submissions</th>
              <th className="p-3 text-left">Placements</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => (
              <tr key={job.id} className="border-t">
                <td className="p-3">{job.title}</td>
                <td className="p-3">{job.location || '-'}</td>
                <td className="p-3">{job.payRate || '-'}</td>
                <td className="p-3">{job.openings}</td>
                <td className="p-3">{job.submissionsCount}</td>
                <td className="p-3">
                  {job.placements}/{job.submissionsCount}
                </td>
                <td className="p-3">-</td>
                <td className="p-3">
                  <Link
                    to={`/jobs/${job.id}/pipeline`}
                    className="text-blue-600 hover:underline"
                  >
                    Pipeline
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-600">
                  No {categories.find(c => c.value === filter).label} jobs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
