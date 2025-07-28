
const API = "http://localhost:4000";
/**
 * Dashboard Data
 */
export async function getDashboardData() {
  const res = await fetch(`${API}/dashboard`);
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}
// (Truncated for brevity in this example)

/**
 * Jobs
 */
export async function getJobs() {
  const res = await fetch(`${API}/jobs`);
  if (!res.ok) throw new Error("Failed to load jobs");
  return res.json();
}

export async function getJob(jobId) {
  const res = await fetch(`${API}/jobs/${encodeURIComponent(jobId)}`);
  if (!res.ok) throw new Error("Failed to load job");
  return res.json();
}

export async function searchJobs(filters = {}) {
  const qs = Object.entries(filters)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${encodeURIComponent(k)}_like=${encodeURIComponent(v)}`)
    .join("&");
  const url = `${API}/jobs?stage=hiring${qs ? "&" + qs : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to search jobs");
  return res.json();
}

export async function createJob(data) {
  const res = await fetch(`${API}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post job");
  return res.json();
}

export async function updateJob(jobId, data) {
  const res = await fetch(`${API}/jobs/${encodeURIComponent(jobId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update job");
  return res.json();
}

export async function deleteJob(jobId) {
  const res = await fetch(`${API}/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete job");
  return res.text();
}

/**
 * Submissions / Pipeline
 */
export async function getPipeline(jobId) {
  const res = await fetch(`${API}/submissions?jobId=${encodeURIComponent(jobId)}`);
  if (!res.ok) throw new Error("Failed to load submissions");
  return res.json();
}

export async function getAllSubmissions() {
  const res = await fetch(`${API}/submissions`);
  if (!res.ok) throw new Error("Failed to load submissions");
  return res.json();
}

export async function submitCandidate(data) {
  const res = await fetch(`${API}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit candidate");
  return res.json();
}

export async function updateSubmission(subId, data) {
  const res = await fetch(`${API}/submissions/${encodeURIComponent(subId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update submission");
  const updatedSubmission = await res.json();

  // ✅ When accepted, set the job stage to "active"
  if (data.status === 'accepted') {
    const jobRes = await fetch(`${API}/jobs/${encodeURIComponent(updatedSubmission.jobId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "active" }),
    });
    if (!jobRes.ok) throw new Error("Failed to update job stage to active");
  }

  return updatedSubmission;
}

/**
 * Candidates (Resume Viewer)
 */
export async function getCandidate(candId) {
  const res = await fetch(`${API}/candidates/${encodeURIComponent(candId)}`);
  if (!res.ok) throw new Error("Failed to load candidate");
  return res.json();
}

/**
 * Companies (Onboarding)
 */
export async function createCompany(data) {
  const res = await fetch(`${API}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create company");
  return res.json();
}

export async function signupCompany({ firstName, lastName, email, password, domain }) {
  const compRes = await fetch(`${API}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${firstName} ${lastName}`,
      ein: "",
      website: "",
      domain,
    }),
  });
  if (!compRes.ok) throw new Error("Failed to create company");
  const company = await compRes.json();

  const userRes = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      role: "company",
      companyId: company.id,
      firstName,
      lastName,
    }),
  });
  if (!userRes.ok) throw new Error("Failed to create company user");
  return userRes.json();
}

/**
 * Authentication
 */
export async function adminSignup(data) {
  const res = await fetch(`${API}/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to sign up admin");
  return res.json();
}

/**
 * Agency Recruiters
 */
export async function getAgencyRecruiters(agencyId) {
  const res = await fetch(`${API}/agencyRecruiters?agencyId=${encodeURIComponent(agencyId)}`);
  if (!res.ok) throw new Error("Could not load recruiters");
  return res.json();
}

export async function inviteRecruiter(data) {
  const res = await fetch(`${API}/agencyRecruiters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Invite failed");
  return res.json();
}

export async function signupRecruiter({ email, password, agencyId, firstName, lastName }) {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password,
      role: "agency_recruiter",
      agencyId,
      firstName,
      lastName,
    }),
  });
  if (!res.ok) throw new Error("Sign-up failed");
  return res.json();
}

/**
 * Agencies
 */
export async function getAgencies() {
  const res = await fetch(`${API}/agencies`);
  if (!res.ok) throw new Error("Failed to load agencies");
  return res.json();
}

export async function createAgency(data) {
  const res = await fetch(`${API}/agencies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create agency");
  return res.json();
}

export async function signupAgencyAdmin({ email, password, agencyId, firstName, lastName }) {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email,
      password,
      role: "agency_admin",
      agencyId,
      firstName,
      lastName,
    }),
  });
  if (!res.ok) throw new Error("Failed to create agency-admin user");
  return res.json();
}

export async function deleteAgencyRecruiter(id) {
  const res = await fetch(`${API}/agencyRecruiters/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete recruiter");
  return res.json();
}

export async function getAgencyJobs(agencyId) {
  const res = await fetch(`${API}/jobs?agencyId=${encodeURIComponent(agencyId)}`);
  if (!res.ok) throw new Error("Failed to load agency jobs");
  return res.json();
}

export async function updateJobAssignment(jobId, { recruiterId }) {
  const res = await fetch(`${API}/jobs/${encodeURIComponent(jobId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignedRecruiter: recruiterId }),
  });
  if (!res.ok) throw new Error("Failed to update assignment");
  return res.json();
}

/**
 * Dashboard widgets
 */
export async function getPendingSubmissions() {
  const res = await fetch(`${API}/submissions?status=pending`);
  if (!res.ok) throw new Error("Failed to load pending submissions");
  return res.json();
}

export async function getActiveJobs() {
  const [jobs, submissions] = await Promise.all([
    fetch(`${API}/jobs`).then(res => res.json()),
    fetch(`${API}/submissions?status=accepted`).then(res => res.json())
  ]);

  const activeJobIds = new Set(submissions.map(sub => sub.jobId));

  return jobs.filter(job =>
    activeJobIds.has(job.id) && job.stage === "active"
  );
}
