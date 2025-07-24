// src/pages/FirstJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';

export default function FirstJob() {
  const [form, setForm] = useState({
    title:          '',
    location:       '',
    payRate:        '',
    payType:        'hourly',   // or 'salary'
    description:    '',
    duties:         '',
    qualifications: '',
    benefits:       '',
    visibility:     'public'    // or 'private'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // basic required‐fields validation
    if (!form.title.trim() || !form.location.trim() || !form.payRate.trim()) {
      setError('Please fill in at least Title, Location, and Pay Rate.');
      return;
    }
    setError('');

    try {
      await createJob({
        title:          form.title,
        location:       form.location,
        payRate:        form.payRate,
        payType:        form.payType,
        description:    form.description,
        duties:         form.duties,
        qualifications: form.qualifications,
        benefits:       form.benefits,
        visibility:     form.visibility
      });

      // 👉 Go to the company dashboard after creating the first job
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create job');
    }
  }

  function handleSkip() {
    // even if skipped, go to dashboard
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Your First Job
        </h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Pay Rate</label>
            <div className="flex space-x-2">
              <input
                name="payRate"
                value={form.payRate}
                onChange={handleChange}
                placeholder="Amount"
                className="flex-1 p-2 border rounded"
                required
              />
              <select
                name="payType"
                value={form.payType}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="hourly">Hourly</option>
                <option value="salary">Salary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
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
            <label className="block mb-1 font-medium">Qualifications</label>
            <textarea
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Benefits</label>
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <span className="block mb-1 font-medium">
              Visibility{' '}
              <span
                className="text-gray-500 cursor-help"
                title="Public: visible to all Loopers. Private: only to you and selected Loopers."
              >
                ?
              </span>
            </span>
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

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
