// src/components/JobsTable.jsx
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { getJobs, updateJob, deleteJob } from '../services/api'
import { AuthContext } from '../auth/AuthContext'

// All possible tabs
const ALL_TABS = [
  { label: 'Active',   value: 'in-progress' },
  { label: 'Open',     value: 'hiring'      },
  { label: 'Closed',   value: 'past'        },
  { label: 'Drafts',   value: 'draft'       },
]

/**
 * Props:
 *   - allowedStages: array of stage‐values to show in tabs (defaults to ALL)
 *   - fetchJobs:     optional async fn to load jobs (falls back to getJobs())
 */
export default function JobsTable({
  allowedStages = ALL_TABS.map(t => t.value),
  fetchJobs
}) {
  const { user } = useContext(AuthContext)
  const isAgency = user?.role === 'agency_admin' || user?.role === 'agency_recruiter'

  // Filter the tabs down to only those you want
  const tabs = ALL_TABS.filter(t => allowedStages.includes(t.value))
  const [selectedTab, setSelectedTab] = useState(tabs[0].value)

  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)

  // load on mount (and if fetchJobs changes)
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = fetchJobs
          ? await fetchJobs()
          : await getJobs()
        setJobs(data)
      } catch (err) {
        console.error('Failed to load jobs', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [fetchJobs])

  // Only show jobs in the selected stage
  const visibleJobs = jobs.filter(j => j.stage === selectedTab)

  // Change a job’s stage (e.g. “close”, “reopen”, “publish”)
  const changeStage = async (id, newStage) => {
    setJobs(js => js.map(j => j.id === id ? { ...j, stage: newStage } : j))
    try {
      await updateJob(id, { stage: newStage })
    } catch (err) {
      console.error('Failed to update job', err)
    }
  }

  // Permanently delete a job
  const handleDelete = async id => {
    setJobs(js => js.filter(j => j.id !== id))
    try {
      await deleteJob(id)
    } catch (err) {
      console.error('Failed to delete job', err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs (only show when there’s more than one) */}
      {tabs.length > 1 && (
        <ul className="flex space-x-6 border-b mb-4">
          {tabs.map(tab => (
            <li
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`pb-2 cursor-pointer ${
                selectedTab === tab.value
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading jobs…</p>
      ) : visibleJobs.length === 0 ? (
        <p className="text-gray-500">No jobs in this category.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Pay Rate</th>
              <th className="px-4 py-2 text-center">Openings</th>
              <th className="px-4 py-2 text-center">Submissions</th>
              <th className="px-4 py-2 text-center">Placements</th>
              <th className="px-4 py-2 text-center">Priority</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visibleJobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{job.title}</td>
                <td className="px-4 py-2">{job.location}</td>
                <td className="px-4 py-2">
                  {job.payRate && job.payType
                    ? `$${job.payRate}${job.payType === 'hourly' ? '/hr' : '/yr'}`
                    : '-'}
                </td>
                <td className="px-4 py-2 text-center">{job.openings ?? 0}</td>
                <td className="px-4 py-2 text-center">{job.submissionsCount ?? 0}</td>
                <td className="px-4 py-2 text-center">
                  {job.placementsCount ?? 0}/{job.openings ?? 0}
                </td>
                <td className="px-4 py-2 text-center">{job.priority || '-'}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                  {/* Active & Open */}
                  {(job.stage === 'in-progress' || job.stage === 'hiring') && (
                    <>
                      <Link
                        to={
                          isAgency
                            ? `/agency/jobs/${job.id}/submit`
                            : `/jobs/${job.id}/pipeline`
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        {isAgency ? 'Submit' : 'Candidates'}
                      </Link>
                      <button
                        onClick={() => changeStage(job.id, 'past')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        {isAgency ? 'Unassign Job' : 'Close Job'}
                      </button>
                    </>
                  )}

                  {/* Closed */}
                  {job.stage === 'past' && (
                    <>
                      <button
                        onClick={() => changeStage(job.id, 'in-progress')}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Reopen
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {/* Drafts (only for companies) */}
                  {job.stage === 'draft' && (
                    <>
                      <Link
                        to={`/jobs/new?edit=${job.id}`}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
