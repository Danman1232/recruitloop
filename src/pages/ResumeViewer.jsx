// src/pages/ResumeViewer.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate }    from 'react-router-dom';
import { AuthContext }                from '../auth/AuthContext';
import { getCandidate, updateSubmission } from '../services/api';

export default function ResumeViewer() {
  const { candId, jobId } = useParams();
  const { logout, user }  = useContext(AuthContext);
  const navigate          = useNavigate();

  const [cand, setCand]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCandidate(candId);
        setCand(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [candId]);

  if (loading) return <p className="p-8">Loading resume…</p>;
  if (error)   return <p className="p-8 text-red-600">{error}</p>;
  if (!cand)   return <p className="p-8">Candidate not found.</p>;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  async function handleAccept() {
    try {
      await updateSubmission(candId, { status: 'accepted' });
      setContactVisible(true);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDecline() {
    let feedback = '';
    while (feedback !== null && !feedback.trim()) {
      feedback = window.prompt('Please provide feedback for this submission:');
      if (feedback === null) return;
      if (!feedback.trim()) alert('Feedback cannot be blank.');
    }
    try {
      await updateSubmission(candId, { status: 'declined', feedback });
      navigate(`/jobs/${jobId}/pipeline`, { replace: true });
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleFeedback() {
    const fb = window.prompt('Enter feedback for the Looper:');
    if (!fb) return;
    try {
      await updateSubmission(candId, { feedback: fb });
      alert('Feedback sent.');
    } catch (err) {
      alert(err.message);
    }
  }

  function handleShare() {
    window.prompt('Enter email address to share with:', '');
  }

  return (
    <>
      {/* Candidate Name & Logout */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{cand.name}</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">({user.username})</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Professional Summary */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Professional Summary</h3>
        <p>{cand.summary}</p>
      </section>

      {/* Work Experience */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
        {cand.experience.map((exp, i) => (
          <div key={i} className="mb-6 bg-white p-4 rounded shadow">
            <h4 className="font-semibold">{exp.title}</h4>
            <p className="text-gray-600 text-sm">
              {exp.company} • {exp.dates}
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              {exp.duties.map((d, j) => <li key={j}>{d}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {/* Contact Info (shown after Accept) */}
      {contactVisible && cand.contactInfo && (
        <section className="mb-8 p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p>{cand.contactInfo}</p>
        </section>
      )}

      {/* Action Buttons */}
      <section className="flex space-x-4">
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Decline
        </button>
        <button
          onClick={handleFeedback}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Feedback
        </button>
        <button
          onClick={handleShare}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Share
        </button>
      </section>
    </>
  );
}
