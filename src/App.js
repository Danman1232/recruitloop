// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// auth + layout
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import Layout           from './components/Layout';

// public pages
import Login            from './components/Login';
import SignUpChoice     from './pages/SignUpChoice';
import SignupCompany    from './pages/SignupCompany';
import SignupAgency     from './pages/SignupAgency';
import SignupLooper     from './pages/SignupLooper';
import SignupRecruiter  from './pages/SignupRecruiter';
import Unauthorized     from './components/Unauthorized';
import VerifyEmail      from './pages/VerifyEmail';

// onboarding + first‐job (public)
import CompanyOnboarding from './pages/CompanyOnboarding';
import PaymentCredit     from './pages/PaymentCredit';
import PaymentBank       from './pages/PaymentBank';
import FirstJob          from './pages/FirstJob';

// company
import Dashboard          from './pages/Dashboard';
import CompanySubmissions from './pages/CompanySubmissions';
import CompanyJobs        from './pages/CompanyJobs';
import PostJob            from './pages/PostJob';

// looper
import LooperDashboard   from './pages/LooperDashboard';
import JobSearch         from './pages/JobSearch';
import JobDetail         from './pages/JobDetail';
import Pipeline          from './pages/Pipeline';
import ResumeViewer      from './pages/ResumeViewer';
import LooperSubmissions from './pages/LooperSubmissions';

// agency
import AgencyDashboard   from './pages/AgencyDashboard';
import AgencyRecruiters  from './pages/AgencyRecruiters';
import AgencyJobs        from './pages/AgencyJobs';
import AgencySubmissions from './pages/AgencySubmissions';
import SubmitCandidate   from './pages/SubmitCandidate';

// marketplace
import Jobs from './pages/Jobs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ─── PUBLIC ────────────────────────────────────────────── */}
          <Route path="/login"            element={<Login />} />
          <Route path="/signup"           element={<SignUpChoice />} />
          <Route path="/signup/company"   element={<SignupCompany />} />
          <Route path="/signup/agency"    element={<SignupAgency />} />
          <Route path="/signup/looper"    element={<SignupLooper />} />
          <Route path="/signup-recruiter" element={<SignupRecruiter />} />
          <Route path="/unauthorized"     element={<Unauthorized />} />
          <Route path="/onboard/verify"   element={<VerifyEmail />} />

          {/* ─── ONBOARDING + FIRST JOB (public) ──────────────────── */}
          <Route path="/onboard/info"           element={<CompanyOnboarding />} />
          <Route path="/onboard/payment/credit" element={<PaymentCredit />} />
          <Route path="/onboard/payment/bank"   element={<PaymentBank />} />
          <Route path="/first-job"              element={<FirstJob />} />

          {/* ─── COMPANY ONLY ─────────────────────────────────────── */}
          <Route element={<PrivateRoute allowedRoles={['company']} />}>
            <Route element={<Layout />}>
              <Route path="dashboard"             element={<Dashboard />} />
              <Route path="dashboard/jobs"        element={<CompanyJobs />} />
              <Route path="dashboard/submissions" element={<CompanySubmissions />} />
              <Route path="jobs/new"              element={<PostJob />} />
	      <Route path="jobs/:jobId/pipeline"  element={<Pipeline />} />
   	      <Route path="jobs/:jobId/candidates/:candId/resume" element={<ResumeViewer />} />
            </Route>
          </Route>

          {/* ─── AGENCY ADMIN ONLY ───────────────────────────────── */}
          <Route element={<PrivateRoute allowedRoles={['agency_admin']} />}>
            <Route element={<Layout />}>
              <Route path="agency"               element={<AgencyDashboard />} />
              <Route path="agency/recruiters"    element={<AgencyRecruiters />} />
              <Route path="agency/jobs"          element={<AgencyJobs />} />
              <Route path="agency/submissions"   element={<AgencySubmissions />} />

              {/* ← allow agency_admin to submit candidates */}
              <Route
                path="agency/jobs/:jobId/submit"
                element={<SubmitCandidate />}
              />
            </Route>
          </Route>

          {/* ─── AGENCY RECRUITER ONLY ───────────────────────────── */}
          <Route element={<PrivateRoute allowedRoles={['agency_recruiter']} />}>
            <Route element={<Layout />}>
              <Route path="agency/jobs"        element={<JobSearch />} />
              <Route path="agency/submissions" element={<AgencySubmissions />} />

              {/* ← allow agency_recruiter too, if needed */}
              <Route path="jobs/:jobId/submit" element={<SubmitCandidate />} />
            </Route>
          </Route>

          {/* ─── LOOPER ONLY ─────────────────────────────────────── */}
          <Route element={<PrivateRoute allowedRoles={['looper']} />}>
            <Route element={<Layout />}>
              <Route path="dashboard"                             element={<LooperDashboard />} />
              <Route path="jobs"                                  element={<JobSearch />} />
              <Route path="jobs/:jobId"                           element={<JobDetail />} />
              <Route path="jobs/:jobId/submit"                    element={<SubmitCandidate />} />
              <Route path="jobs/:jobId/pipeline"                  element={<Pipeline />} />
              <Route path="jobs/:jobId/candidates/:candId/resume" element={<ResumeViewer />} />
              <Route path="submissions"                           element={<LooperSubmissions />} />
            </Route>
          </Route>

          {/* ─── MARKETPLACE (optional public listing) ─────────── */}
          <Route path="/marketplace" element={<Jobs />} />

          {/* ─── CATCH-ALL ───────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
