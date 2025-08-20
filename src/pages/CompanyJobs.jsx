// src/pages/CompanyJobs.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { getJobs, getAllSubmissions, updateJob } from '../services/api'
import { Link } from 'react-router-dom'

export default function CompanyJobs() {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('open')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        // Use submissions as source of truth for “in pipeline”
        const [allJobs, allSubs] = await Promise.all([getJobs(), getAllSubmissions()])
        setJobs(allJobs || [])
        setSubmissionIndex(buildSubmissionIndex(allSubs || []))
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
    { label: 'Active', value: 'active' },
    { label: 'Open',   value: 'open'   },
    { label: 'Closed', value: 'closed' },
    { label: 'Drafts', value: 'draft'  },
  ]

  // ── helpers ───────────────────────────────────────────────────────
  const normalize = (v) => (v ?? '').toString().trim().toLowerCase()
  const toKey = (v) => (v == null ? '' : String(v))

  const getJobId = (j) =>
    toKey(j?.id ?? j?.jobId ?? j?._id ?? j?.job_id ?? j?.uuid ?? j?.key)

  const getSubmissionJobId = (s) =>
    toKey(
      s?.jobId ??
      s?.job_id ??
      s?.job?.id ??
      s?.job?.jobId ??
      s?.job?._id
    )

  // Build a lookup: jobId -> submission count and a set of jobIds that have ≥1 submission
  const [submissionIndex, setSubmissionIndex] = useState({ byJobId: new Map(), idsWithSubs: new Set() })
  function buildSubmissionIndex(subs) {
    const byJobId = new Map()
    const idsWithSubs = new Set()
    for (const s of subs) {
      const jid = getSubmissionJobId(s)
      if (!jid) continue
      const next = (byJobId.get(jid) || 0) + 1
      byJobId.set(jid, next)
      idsWithSubs.add(jid)
    }
    return { byJobId, idsWithSubs }
  }

  const getSubsCountForRow = (job) => submissionIndex.byJobId.get(getJobId(job)) || 0

  const isClosed = (job) => {
    const stage = normalize(job.stage)
    const status = normalize(job.status)
    return stage === 'closed' || status === 'closed' || job.isClosed === true
  }

  const isDraft = (job) => {
    const stage = normalize(job.stage)
    const status = normalize(job.status)
    return (
      stage === 'draft' ||
      status === 'draft' ||
      ['pending', 'review'].includes(stage) ||
      ['pending', 'review'].includes(status)
    )
  }

  // Format pay rate from various possible fields
  const num = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  const fmt = (n) =>
    n == null ? null : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)

  function getPayDisplay(job) {
    const from = num(job.payRateFrom ?? job.payFrom ?? job.minPay ?? job.salaryFrom ?? job.rateFrom)
    const to   = num(job.payRateTo   ?? job.payTo   ?? job.maxPay ?? job.salaryTo   ?? job.rateTo)
    const type = (job.payType ?? job.rateType ?? '').toLowerCase()
    const unit = type === 'salary' ? '/yr' : '/hr'
    if (from != null && to != null) return `${fmt(from)}–${fmt(to)}${unit}`
    if (from != null) return `${fmt(from)}${unit}`
    if (to != null)   return `${fmt(to)}${unit}`
    return '-'
  }

  // Partition EXCLUSIVELY using the submissions index
  const partitions = useMemo(() => {
    const buckets = { active: [], open: [], closed: [], draft: [] }
    for (const job of jobs) {
      if (isClosed(job)) { buckets.closed.push(job); continue }
      if (isDraft(job))  { buckets.draft.push(job);  continue }

      const jid = getJobId(job)
      const inPipeline = jid && submissionIndex.idsWithSubs.has(jid)

      if (inPipeline) buckets.active.push(job)
      else            buckets.open.push(job)
    }
    return buckets
  }, [jobs, submissionIndex])

  const filtered =
    filter === 'active' ? partitions.active :
    filter === 'closed' ? partitions.closed :
    filter === 'draft'  ? partitions.draft  :
                          partitions.open

  // ── actions ───────────────────────────────────────────────────────
  async function handleClose(job) {
    const id = getJobId(job)
    if (!id) return
    // optimistic update
    const prev = { stage: job.stage, status: job.status, isClosed: job.isClosed }
    setJobs(prevJobs =>
      prevJobs.map(j => (getJobId(j) === id ? { ...j, stage: 'closed', status: 'closed', isClosed: true } : j))
    )
    try {
      if (typeof updateJob === 'function') {
        await updateJob(id, { stage: 'closed', status: 'closed', isClosed: true })
      }
      // optional: setFilter('closed')
    } catch (e) {
      console.error('Failed to close job', e)
      alert('Failed to close job')
      // revert
      setJobs(prevJobs =>
        prevJobs.map(j =>
          (getJobId(j) === id ? { ...j, ...prev } : j)
        )
      )
    }
  }

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
              <th className="p-3 text-center w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(job => {
              const subs = getSubsCountForRow(job)
              const showActionButtons = filter === 'active' || filter === 'open'
              return (
                <tr key={getJobId(job)} className="border-t">
                  <td className="p-3">{job.title}</td>
                  <td className="p-3">{job.location || '-'}</td>
                  <td className="p-3">{getPayDisplay(job)}</td>
                  <td className="p-3">{job.openings}</td>
                  <td className="p-3">{subs}</td>
                  <td className="p-3">
                    {job.placements}/{subs}
                  </td>
                  <td className="p-3">{job.priority || '-'}</td>
                  <td className="p-3 text-center w-48">
                    {showActionButtons ? (
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/jobs/${getJobId(job)}/pipeline`}
                          className="bg-blue-600 text-white px-2 py-1 rounded inline-block"
                        >
                          View
                        </Link>
                        <Link
                          to={`/jobs/${getJobId(job)}/edit`}
                          className="bg-orange-500 text-white px-2 py-1 rounded inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleClose(job)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-600">
                  No {(categories.find(c => c.value === filter)?.label || 'Filtered')} jobs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
