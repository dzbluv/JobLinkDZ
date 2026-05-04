const mockData = {
  profiles: [
    { id: 'p1', full_name: 'Alice Candidate', email: 'alice@example.com', role: 'candidate', phone: '', location: '', created_at: new Date().toISOString() },
    { id: 'p2', full_name: 'Bob Recruiter', email: 'bob@example.com', role: 'admin', phone: '', location: '', created_at: new Date().toISOString() }
  ],
  job_offers: [
    { id: 'j1', title: 'Frontend Engineer', company: 'Acme', location: 'Algiers', job_type: 'Full-time', salary_range: '50k-70k', description: 'Build beautiful UIs', requirements: 'React, CSS', created_at: new Date().toISOString(), status: 'open' },
    { id: 'j2', title: 'Backend Engineer', company: 'Beta', location: 'Remote', job_type: 'Part-time', salary_range: '40k-60k', description: 'APIs and databases', requirements: 'Node.js, SQL', created_at: new Date().toISOString(), status: 'open' }
  ],
  applications: [
    { id: 'a1', candidate_id: 'p1', job_offer_id: 'j1', status: 'pending', cv_url: null, cover_message: 'Excited to apply', created_at: new Date().toISOString() }
  ]
}

export default mockData
