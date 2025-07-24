// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingSubmissions, updateSubmission } from '../services/api';

export default function Dashboard() {
  const [pending, setPending] = useState([]);
  const [loadingPend, setLoadingPend] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPendingSubmissions();
        setPending(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPend(false);
      }
    })();
  }, []);

  async function handleStatusChange(id, status) {
    try {
      await updateSubmission(id, { status });
      setPending(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  function handleViewResume(fileName) {
    alert(`Resume: ${fileName}`);
  }

  return (
    <main className="flex-1 bg-gray-100 p-6 overflow-y-auto h-screen flex">
      {/* Left main area */}
      <div className="w-3/4 pr-4">
        {/* Page Header */}
        <header className="mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
        </header>

        {/* Metrics */}
        <section className="mb-8 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm text-gray-500">Wallet Balance</h4>
            <p className="text-xl font-semibold text-orange-500">$25,456</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm text-gray-500">Active Jobs</h4>
            <p className="text-xl font-semibold text-blue-500">06</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm text-gray-500">Open Jobs</h4>
            <p className="text-xl font-semibold">15</p>
          </div>
        </section>

        {/* Pending Response */}
        <section className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Pending Response</h3>
          {loadingPend ? (
            <p>Loading…</p>
          ) : pending.length === 0 ? (
            <p className="text-gray-500">No submissions awaiting response.</p>
          ) : (
            <div className="space-y-4">
              {pending.slice(0, 5).map(sub => (
                <div
                  key={sub.id}
                  className="bg-white p-3 rounded shadow grid grid-cols-7 items-start gap-4 text-sm"
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex justify-center pt-6">
                    <input type="checkbox" className="form-checkbox w-4 h-4 text-blue-600" />
                  </div>

                  {/* Looper */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold block mb-1">Looper</span>
                    <div className="flex flex-col items-center mt-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="profile"
                        className="w-10 h-10 rounded-full mb-1"
                      />
                      <p className="font-semibold">{sub.name}</p>
                      <p className="text-gray-500 text-xs">{sub.looperEmail || "abc@mail.com"}</p>
                    </div>
                  </div>

                  {/* Job Title */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold block mb-1">Job Title</span>
                    <p className="mt-2">{sub.jobTitle}</p>
                  </div>

                  {/* Location */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold block mb-1">Location</span>
                    <p className="mt-2">{sub.jobLocation}</p>
                  </div>

                  {/* Pay */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold block mb-1">Pay</span>
                    <p className="mt-2">{sub.targetPay}</p>
                  </div>

                  {/* Resume */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold block mb-1">Resume</span>
                    <button onClick={() => handleViewResume(sub.resumeName)} className="mt-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                        alt="Resume"
                        className="w-7 h-7"
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs font-semibold block mb-1">Action</span>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <img
                        src="https://www.freeiconspng.com/uploads/black-circle-social-media-share-icon-png-25.png"
                        alt="Share"
                        className="w-7 h-7 cursor-pointer"
                        title="Share"
                      />
                      <button
                        onClick={() => handleStatusChange(sub.id, 'accepted')}
                        className="bg-green-500 text-white px-3 py-2 text-xs rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(sub.id, 'declined')}
                        className="bg-red-500 text-white px-3 py-2 text-xs rounded"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* View All */}
              <div className="text-right mt-2">
                <Link
                  to="/submissions"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View All →
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Right sidebar */}
      <aside className="w-1/4 space-y-6">
        {/* Notifications */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-3">Notifications</h4>
          <ul className="space-y-2 text-sm">
            <li className="border p-2 rounded">
              <strong>Phil Jones</strong> submitted a resume for <em>Service Manager</em> in Chicago, IL
              <button className="block text-orange-500 text-xs mt-1">View Resume</button>
            </li>
            <li className="border p-2 rounded">
              <strong>Ervin Lawrence</strong> submitted a resume for <em>Service Tech</em> in Detroit, MI
              <button className="block text-orange-500 text-xs mt-1">View Resume</button>
            </li>
          </ul>
        </div>

        {/* Contact List */}
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-semibold mb-3">Contact List</h4>
          <ul className="space-y-3 text-sm">
            {["Phil Jones", "Ervin Lawrence", "Andrea Holloway", "Timmy Snyder"].map(name => (
              <li key={name} className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-gray-500 text-xs">abc@mail.com</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
