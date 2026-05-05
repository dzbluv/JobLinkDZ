export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  resume_url?: string;
  cover_letter?: string;
  applied_at: string;
  created_at: string;
  // Joined relations from Supabase .select('*, jobs(...), users(...)')
  jobs?: { title: string; company?: string; company_id?: string };
  users?: { full_name: string; email?: string; phone?: string; location?: string };
}

// Helper accessors — use these in UI code to safely read joined data
export function getAppCandidateName(app: Application): string {
  return app.users?.full_name || 'Unknown Candidate';
}
export function getAppCandidateEmail(app: Application): string {
  return app.users?.email || 'N/A';
}
export function getAppCandidatePhone(app: Application): string {
  return app.users?.phone || 'N/A';
}
export function getAppCandidateLocation(app: Application): string {
  return app.users?.location || 'N/A';
}
export function getAppJobTitle(app: Application): string {
  return app.jobs?.title || 'Unknown Job';
}
export function getAppCompanyName(app: Application): string {
  return app.jobs?.company || 'Unknown Company';
}

export const mockApplications: Application[] = [
  {
    id: 'app_1',
    user_id: '1',
    job_id: '1',
    status: 'reviewing',
    resume_url: 'candidate_cv.pdf',
    cover_letter: 'I am highly interested in this senior position as it matches my skills perfectly.',
    applied_at: '2024-03-25T08:30:00Z',
    created_at: '2024-03-25T08:30:00Z',
    jobs: { title: 'Senior Frontend Developer', company: 'TechCorp' },
    users: { full_name: 'Ahmed Benali' }
  },
  {
    id: 'app_2',
    user_id: '1',
    job_id: '2',
    status: 'pending',
    resume_url: 'candidate_cv.pdf',
    cover_letter: 'I love designing beautiful UIs and I believe I would be a great fit for your team.',
    applied_at: '2024-03-26T15:00:00Z',
    created_at: '2024-03-26T15:00:00Z',
    jobs: { title: 'UX/UI Designer', company: 'DesignLab' },
    users: { full_name: 'Ahmed Benali' }
  }
];
