export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  resume_url?: string;
  cover_letter?: string;
  applied_at: string;
  created_at: string;
  jobs?: { title: string };
  users?: { full_name: string };
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
    jobs: { title: 'Senior Frontend Developer' },
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
    jobs: { title: 'UX/UI Designer' },
    users: { full_name: 'Ahmed Benali' }
  }
];
