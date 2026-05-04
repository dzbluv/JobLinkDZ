export const mockUsers = [
  {
    id: '1',
    full_name: 'John Candidate',
    email: 'candidate@joblinkdz.com',
    password: 'password123',
    role: 'candidate',
    phone: '+213 555 123 456',
    location: 'Algiers, Algeria',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    full_name: 'Admin Recruiter',
    email: 'admin@joblinkdz.com',
    password: 'admin123',
    role: 'admin',
    phone: '+213 555 987 654',
    location: 'Oran, Algeria',
    created_at: new Date().toISOString(),
  }
];

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'candidate' | 'admin';
  phone: string;
  location: string;
}
