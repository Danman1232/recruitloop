// src/pages/AgencySubmissions.jsx
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import {
  getAllSubmissions,
  getAgencyJobs,
  getJob
} from '../services/api'

export default function AgencySubmissions() {
  const { user } = useContext(AuthContext)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [filter, setFilter]           = useState('all')

  const tabs = [
    { label: 'All',               value: 'all' },
    { label: 'Pending Response',  value: 'pending' },
    { label: 'Accepted',          value: 'accepted' },
    { label: 'Placed',            value: 'placed' },
    { label: 'Declined',          value: 'declined' }
  ]

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // fetch all submissions & this agency's jobs in parallel
        const [ allSubs, agencyJobs ] = await Promise.all([
          getAllSubmissions(),
          getAgencyJobs(user.agencyId)
        ])
        // only keep subs for this agency's job IDs
        const jobIds = new Set(agencyJobs.map(j => j.id))
        const relevant = allSubs.filter(s => jobIds.has(s.jobId))

        // enrich each submission with its job details
        const withJobs = await Promise.all(
          relevant.map(async s => {
            const job = await getJob(s.jobId)
            return { ...s, job }
          })
        )
        setSubmissions(withJobs)
      } catch (err) {
        console.error(err)
        setError('Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.agencyId])

  const visible = submissions.filter(s =>
    filter === 'all' ? true : s.status === filter
  )

  if (loading) return <p>Loading submissions…</p>
  if (error)   return <p className="text-red-600">{error}</p>

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-6">Submissions</h2>

      {/* status tabs */}
      <ul className="flex space-x-4 mb-6">
        {tabs.map(tab => (
          <li key={tab.value}>
            <button
              onClick={() => setFilter(tab.value)}
              className={`pb-2 ${
                filter === tab.value
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* submissions table */}
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Looper</th>
            <th className="px-4 py-2 text-left">Candidate</th>
            <th className="px-4 py-2 text-left">Job Title</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Submitted</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {visible.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{s.looper}</td>
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.job?.title || '—'}</td>
              <td className="px-4 py-2">{s.job?.location || '—'}</td>
              <td className="px-4 py-2">
                {s.createdAt
                  ? new Date(s.createdAt).toLocaleDateString()
                  : '—'}
              </td>
              <td className="px-4 py-2 text-center">
                <Link
                  to={`/agency/submissions/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
