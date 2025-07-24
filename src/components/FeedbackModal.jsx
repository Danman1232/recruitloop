import React, { useState } from 'react';

export default function FeedbackModal({  
  open,        // boolean  
  title,       // e.g. "Why are you declining this candidate?"  
  onCancel,    // fn to close  
  onSubmit     // fn receives feedback string  
}) {
  const [feedback, setFeedback] = useState('');
  const [error, setError]       = useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded mb-4"
          placeholder="Provide some feedback…"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!feedback.trim()) {
                setError('Feedback is required.');
                return;
              }
              onSubmit(feedback);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Submit & Decline
          </button>
        </div>
      </div>
    </div>
  );
}
