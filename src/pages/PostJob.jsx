// src/pages/PostJob.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate }       from 'react-router-dom'
import { createJob }         from '../services/api'
import AuthContext           from '../auth/AuthContext'

export default function PostJob() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)        // ← get current user
  const [companyName, setCompanyName] = useState('')
  const [form, setForm] = useState({
    title:        '',
    location:     '',
    payFrom:      '',
    payTo:        '',
    payType:      'hourly',
    openings:     '',
    priority:     '',
    overview:     '',
    duties:       '',
    expReq:       '',
    expPref:      '',
    benefits:     '',
    visibility:   'public',
    privateScope: 'me',    // 'me' or 'custom'
    recipients:   []       // array for selected recipient(s)
  })
  const [error, setError]       = useState('')
  const [agencies, setAgencies] = useState([])
  const [loopers, setLoopers]   = useState([])

  // ─── fetch agencies + loopers for autocomplete ────────────────────
  useEffect(() => {
    fetch('http://localhost:4000/agencies')
      .then(r => r.json())
      .then(setAgencies)
      .catch(console.error)

    fetch('http://localhost:4000/users?role=looper')
      .then(r => r.json())
      .then(setLoopers)
      .catch(console.error)
  }, [])

  // ─── fetch this company’s name ─────────────────────────────────────
  useEffect(() => {
    if (!user?.companyId) return
    fetch(`http://localhost:4000/companies/${user.companyId}`)
      .then(r => r.json())
      .then(c => setCompanyName(c.name))
      .catch(console.error)
  }, [user])

  // merge agencies + loopers into one recipient list
  const recipientOptions = [
    ...agencies.map(a => ({ value: a.id,    label: `Agency: ${a.name}`   })),
    ...loopers.map(l   => ({ value: l.id,    label: `Looper: ${l.email}` }))
  ]

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handlePost(e) {
    e.preventDefault()
    setError('')

    const fromNum = parseFloat(form.payFrom.replace(',', '.'))
    const toNum   = parseFloat(form.payTo.replace(',', '.'))

    try {
      await createJob({
        companyId:      user.companyId,               // ← include companyId
        title:          form.title,
        location:       form.location,
        payRateFrom:    isNaN(fromNum) ? 0 : fromNum,
        payRateTo:      isNaN(toNum)   ? 0 : toNum,
        payType:        form.payType,
        openings:       Number(form.openings),
        description:    form.overview,
        duties:         form.duties,
        qualifications: form.expReq,
        benefits:       form.benefits,
        stage:          'hiring',
        visibility:     form.visibility,
        priority:       form.priority,
        // only include recipients when privateScope === 'custom'
        ...(form.visibility === 'private' && form.privateScope === 'custom' && {
          recipients: form.recipients
        })
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleSave() {
    alert('Save draft (not yet wired)')
  }

  function handleDelete() {
    if (window.confirm('Discard this job?')) {
      setForm({
        title:        '',
        location:     '',
        payFrom:      '',
        payTo:        '',
        payType:      'hourly',
        openings:     '',
        priority:     '',
        overview:     '',
        duties:       '',
        expReq:       '',
        expPref:      '',
        benefits:     '',
        visibility:   'public',
        privateScope: 'me',
        recipients:   []
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handlePost} className="space-y-5">
          {/* ─── Company (read-only) ───────────────────────────── */}
          <div>
            <label className="block mb-1 font-medium">Company</label>
            <input
              value={companyName}
              disabled
              className="w-full p-2 bg-gray-100 border rounded text-gray-700"
            />
          </div>

          {/* ─── Job Title ─────────────────────────────────────── */}
          <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* ─── Location ──────────────────────────────────────── */}
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* ─── Pay Range ────────────────────────────────────── */}
          <div>
            <label className="block mb-1 font-medium">Pay Range</label>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  name="payFrom"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9,\.]*"
                  value={form.payFrom}
                  onChange={handleChange}
                  className="pl-7 p-2 border rounded w-48"
                  required
                />
              </div>
              <span>to</span>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  name="payTo"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9,\.]*"
                  value={form.payTo}
                  onChange={handleChange}
                  className="pl-7 p-2 border rounded w-48"
                  required
                />
              </div>
              <select
                name="payType"
                value={form.payType}
                onChange={handleChange}
                className="ml-auto w-32 p-2 border rounded"
              >
                <option value="hourly">/hr</option>
                <option value="salary">/yr</option>
              </select>
            </div>
          </div>

          {/* ─── Openings & Priority ───────────────────────────── */}
          <div className="flex space-x-4">
            <div className="w-1/3">
              <label className="block mb-1 font-medium">Number of Openings</label>
              <input
                name="openings"
                type="number"
                value={form.openings}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="" disabled>Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          {/* ─── Overview, Duties, Experience, Benefits ────────── */}
          <div>
            <label className="block mb-1 font-medium">Job Overview</label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Job Duties</label>
            <textarea
              name="duties"
              value={form.duties}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Experience (Required)</label>
            <textarea
              name="expReq"
              value={form.expReq}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Experience (Preferred)</label>
            <textarea
              name="expPref"
              value={form.expPref}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Benefits</label>
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* ─── Visibility & Private Scope ───────────────────── */}
          <div>
            <span className="block mb-1 font-medium">Visibility</span>
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={form.visibility === 'public'}
                onChange={handleChange}
                className="mr-2"
              />
              Public
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={form.visibility === 'private'}
                onChange={handleChange}
                className="mr-2"
              />
              Private
            </label>
          </div>
          {form.visibility === 'private' && (
            <div className="p-4 border rounded bg-gray-50 mb-4">
              <span className="block mb-2 font-medium">Private scope</span>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  name="privateScope"
                  value="me"
                  checked={form.privateScope === 'me'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Visible to me only
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="privateScope"
                  value="custom"
                  checked={form.privateScope === 'custom'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Send to:
              </label>
              {form.privateScope === 'custom' && (
                <div className="mt-4">
                  <input
                    list="recipient-list"
                    name="recipients"
                    value={form.recipients[0] || ''}
                    onChange={e =>
                      setForm(f => ({ ...f, recipients: [e.target.value] }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Search agencies or loopers…"
                  />
                  <datalist id="recipient-list">
                    {recipientOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </datalist>
                </div>
              )}
            </div>
          )}

          {/* ─── Buttons ───────────────────────────────────────── */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Post Job
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
