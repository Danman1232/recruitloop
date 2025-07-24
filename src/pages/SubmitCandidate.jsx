import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate }      from 'react-router-dom';
import { getJob, submitCandidate }     from '../services/api';
import { AuthContext }                 from '../auth/AuthContext';

export default function SubmitCandidate() {
  const { jobId } = useParams();
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);

  const [job, setJob]               = useState(null);
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [candidateEmail, setEmail]  = useState('');
  const [targetPay, setTargetPay]   = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [notes, setNotes]           = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const j = await getJob(jobId);
        setJob(j);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please upload a resume file (PDF or DOCX).');
      return;
    }
    setError('');

    // build FormData
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('looper', 'bob');           // TODO: replace with real looper ID
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', candidateEmail);
    formData.append('targetPay', targetPay);
    formData.append('notes', notes);
    formData.append('resume', resumeFile);
    formData.append('createdAt', new Date().toISOString());

    try {
      await submitCandidate(formData);

      // Route back based on who’s submitting
      if (user.role === 'agency_admin' || user.role === 'agency_recruiter') {
        navigate('/agency/submissions');
      } else {
        navigate(`/jobs/${jobId}/pipeline`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error && !job) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">
        Submit Candidate for "{job?.title}"
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {/* Candidate Name */}
        <div>
          <label className="block mb-1 font-medium">Candidate Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="(123) 456-7890"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email Address</label>
          <input
            type="email"
            value={candidateEmail}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="candidate@example.com"
            required
          />
        </div>

        {/* Target Pay */}
        <div>
          <label className="block mb-1 font-medium">Target Pay</label>
          <input
            type="text"
            value={targetPay}
            onChange={e => setTargetPay(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. $50/hr or $80k/yr"
            required
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block mb-1 font-medium">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => setResumeFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Additional candidate details..."
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Candidate
        </button>
      </form>
    </div>
  );
}
