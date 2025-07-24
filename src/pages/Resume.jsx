import React, { useState } from 'react';

export default function Resume() {
  const [show, setShow] = useState(false);

  return (
    <div className="bg-gray-100 p-8 h-screen overflow-auto">
      <div className="max-w-4xl mx-auto bg-white rounded shadow overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Phil Jones – Resume</h2>
          <img src="https://via.placeholder.com/100x40?text=RL+Logo" alt="RecruitLoop Logo" />
        </div>
        <div className="p-6 space-y-6">
          <section>
            <h3 className="font-semibold mb-2">Professional Summary</h3>
            <p>Motivated and skilled Overhead Crane Technician…</p>
          </section>
          <section>
            <h3 className="font-semibold mb-4">Work Experience</h3>
            {/* … */}
          </section>
          {show && (
            <div className="border-t pt-4">
              <h3 className="font-semibold">Contact Information</h3>
              <p>Email: phil.jones@example.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t flex space-x-4">
          <button onClick={()=>setShow(true)} className="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
          <button onClick={()=>alert('Please provide a decline reason.')} className="bg-red-500 text-white px-4 py-2 rounded">Decline</button>
          <button onClick={()=>alert('Feedback dialog')} className="bg-gray-300 px-4 py-2 rounded">Feedback</button>
          <button onClick={()=>alert('Share dialog')} className="bg-blue-600 text-white px-4 py-2 rounded">Share</button>
        </div>
      </div>
    </div>
  );
}
