// Mock service layer - replace with real Supabase calls later
import mockData from '../data/mockData'

export async function fetchJobs(){
  // simulate network
  return new Promise(resolve => setTimeout(()=> resolve(mockData.job_offers), 200))
}

export async function fetchJobById(id){
  return mockData.job_offers.find(j => String(j.id) === String(id)) || null
}

export async function fetchApplicationsByCandidate(candidateId){
  return mockData.applications.filter(a => a.candidate_id === candidateId)
}

export async function applyToJob({ candidate_id, job_offer_id, cover_message }){
  const newApp = {
    id: String(Date.now()),
    candidate_id,
    job_offer_id,
    status: 'pending',
    cv_url: null,
    cover_message,
    created_at: new Date().toISOString()
  }
  mockData.applications.push(newApp)
  return newApp
}
