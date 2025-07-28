// src/pages/Jobs.jsx
import React from 'react';
import JobsTable from '../components/JobsTable';

export default function Jobs() {
  return (
    <main className="flex-1 h-screen bg-gray-100 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">All Jobs</h2>
      </header>
      <section>
        <JobsTable allowedStages={['active','hiring','past','draft']} />
      </section>
    </main>
  );
}
