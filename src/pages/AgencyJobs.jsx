// src/pages/AgencyJobs.jsx
import React, { useContext } from 'react'
import JobsTable from '../components/JobsTable'
import { AuthContext } from '../auth/AuthContext'
import { getAgencyJobs } from '../services/api'

export default function AgencyJobs() {
  const { user } = useContext(AuthContext)

  return (
    <main className="flex-1 h-screen bg-gray-100 p-8 overflow-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Agency Jobs</h2>
      </header>

      <section>
        <JobsTable
          // only show Active, Open and Closed
          allowedStages={['in-progress','hiring','past']}
          // load only this agency’s jobs
          fetchJobs={() => getAgencyJobs(user.agencyId)}
        />
      </section>
    </main>
  )
}
