export interface Application {
  id: string;
  candidate_id: string;
  candidate_name: string; // Added for display
  job_offer_id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  cv_url: string;
  cover_message: string;
  created_at: string;
  job_title: string; // Helper for display
  company_name: string; // Helper for display
  company_id?: string;
}

export const mockApplications: Application[] = [
  {
    id: 'app_1',
    candidate_id: '1',
    candidate_name: 'Ahmed Benali',
    job_offer_id: '1',
    status: 'reviewing',
    cv_url: 'candidate_cv.pdf',
    cover_message: 'I am highly interested in this senior position as it matches my skills perfectly.',
    created_at: '2024-03-25T08:30:00Z',
    job_title: 'Senior Frontend Developer',
    company_name: 'TechFlow Algeria',
    company_id: 'c1'
  },
  {
    id: 'app_2',
    candidate_id: '1',
    candidate_name: 'Ahmed Benali',
    job_offer_id: '2',
    status: 'pending',
    cv_url: 'candidate_cv.pdf',
    cover_message: 'I love designing beautiful UIs and I believe I would be a great fit for your team.',
    created_at: '2024-03-26T15:00:00Z',
    job_title: 'UX/UI Designer',
    company_name: 'Creative Studios DZ',
    company_id: 'c2'
  }
];
