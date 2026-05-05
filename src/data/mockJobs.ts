export interface JobOffer {
  id: string;
  title: string;
  company: string;
  company_id: string;
  logo?: string; // Added logo property
  location: string;
  job_type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | 'Internship';
  salary_range: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  created_at: string;
  status: 'active' | 'closed';
  skills: string[];
  owner_id?: string;
}

export const mockJobs: JobOffer[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechFlow Algeria',
    company_id: 'c1',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechFlow&backgroundColor=6366f1',
    location: 'Algiers (Remote)',
    job_type: 'Full-time',
    salary_range: '120000 - 200000 DA / month',
    description: 'We are looking for a Senior Frontend Developer to lead our UI team and build high-performance web applications using React and Tailwind CSS.',
    requirements: [
      '5+ years of experience with React',
      'Strong knowledge of TypeScript',
      'Experience with modern state management (Zustand, Redux)',
      'Excellent styling skills with Tailwind CSS'
    ],
    responsibilities: [
      'Lead a team of 4 junior developers',
      'Implement responsive and high-performance UI components',
      'Collaborate with designers to implement pixel-perfect designs',
      'Optimize application for maximum speed and scalability'
    ],
    created_at: '2024-03-20T10:00:00Z',
    status: 'active',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Creative Studios DZ',
    company_id: 'c2',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Creative&backgroundColor=ec4899',
    location: 'Oran',
    job_type: 'Contract',
    salary_range: '80000 - 130000 DA / month',
    description: 'Join our design team to create beautiful and intuitive user experiences for our international clients.',
    requirements: [
      '3+ years of UX/UI experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating high-quality visual design',
      'Good understanding of design systems'
    ],
    responsibilities: [
      'Create wireframes and prototypes',
      'Design high-fidelity user interfaces',
      'Conduct user research and usability testing',
      'Collaborate with developers to ensure design fidelity'
    ],
    created_at: '2024-03-21T09:00:00Z',
    status: 'active',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems'],
  },
  {
    id: '3',
    title: 'Backend Node.js Engineer',
    company: 'DataScale solutions',
    company_id: 'c3',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DataScale&backgroundColor=06b6d4',
    location: 'Algiers',
    job_type: 'Full-time',
    salary_range: '100000 - 180000 DA / month',
    description: 'Scalability is our core value. We need a Node.js expert to help us build robust microservices.',
    requirements: [
      'Expert level in Node.js and Express',
      'Experience with PostgreSQL and Redis',
      'Knowledge of Docker and Kubernetes',
      'Understanding of microservices architecture'
    ],
    responsibilities: [
      'Build and maintain scalable backend services',
      'Optimize database queries for performance',
      'Integrate third-party APIs and services',
      'Ensure security and data protection'
    ],
    created_at: '2024-03-22T14:30:00Z',
    status: 'active',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    id: '4',
    title: 'Marketing Specialist',
    company: 'Global Brands',
    company_id: 'c4',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Global&backgroundColor=f59e0b',
    location: 'Constantine',
    job_type: 'Part-time',
    salary_range: '50000 - 90000 DA / month',
    description: 'Help us grow our presence in the East of Algeria through innovative marketing campaigns.',
    requirements: [
      'Bachelor in Marketing or related field',
      'Experience with Social Media Management',
      'Excellent written and verbal communication skills',
      'Data-driven mindset'
    ],
    responsibilities: [
      'Manage social media accounts',
      'Create and execute marketing campaigns',
      'Analyze campaign performance and report metrics',
      'Collaborate with the sales team'
    ],
    created_at: '2024-03-24T11:20:00Z',
    status: 'active',
    skills: ['Social Media', 'SEO', 'Content Strategy'],
  },
  {
    id: '5',
    title: 'Supermarket Cashier',
    company: 'Uno Hypermarket',
    company_id: 'c5',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Uno&backgroundColor=10b981',
    location: 'Setif',
    job_type: 'Full-time',
    salary_range: '30000 - 45000 DA / month',
    description: 'We are looking for a friendly and efficient Cashier to manage all transactions with customers accurately and efficiently at our Setif branch.',
    requirements: [
      'High school diploma or equivalent',
      'Basic math and computer skills',
      'Strong communication and time management skills',
      'Customer satisfaction-oriented'
    ],
    responsibilities: [
      'Handle cash, credit, and scanner transactions',
      'Scan goods and ensure pricing is accurate',
      'Issue receipts, refunds, change or tickets',
      'Maintain a clean and tidy checkout area'
    ],
    created_at: '2024-03-25T08:00:00Z',
    status: 'active',
    skills: ['Customer Service', 'Cash Handling', 'POS Systems'],
  },
  {
    id: '6',
    title: 'Warehouse Manager',
    company: 'Logistics Pro DZ',
    company_id: 'c6',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Logistics&backgroundColor=8b5cf6',
    location: 'Blida',
    job_type: 'Full-time',
    salary_range: '80000 - 120000 DA / month',
    description: 'Seeking an experienced Warehouse Manager to direct receiving, warehousing, and distribution operations.',
    requirements: [
      'Proven work experience as a Warehouse Manager',
      'Expertise in warehouse management procedures and best practices',
      'Proven ability to implement process improvement initiatives',
      'Strong knowledge of warehousing Key Performance Indicators (KPIs)'
    ],
    responsibilities: [
      'Strategically manage warehouse in compliance with company policies',
      'Oversee receiving, warehousing, distribution and maintenance operations',
      'Setup layout and ensure efficient space utilization',
      'Manage stock control and reconcile with data storage system'
    ],
    created_at: '2024-03-26T09:30:00Z',
    status: 'active',
    skills: ['Logistics', 'Inventory Management', 'Leadership'],
  },
  {
    id: '7',
    title: 'Delivery Driver',
    company: 'Yassir Express',
    company_id: 'c7',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Yassir&backgroundColor=ef4444',
    location: 'Annaba',
    job_type: 'Contract',
    salary_range: '40000 - 70000 DA / month',
    description: 'Join our growing delivery network in Annaba. Flexible hours and competitive pay based on successful deliveries.',
    requirements: [
      'Valid driver license',
      'Clean driving record',
      'Own a reliable vehicle or motorcycle',
      'Smartphone with GPS and internet access'
    ],
    responsibilities: [
      'Deliver a wide variety of items to different addresses and through different routes',
      'Follow routes and time schedule',
      'Load, unload, prepare, inspect and operate a delivery vehicle',
      'Collect payments'
    ],
    created_at: '2024-03-27T10:15:00Z',
    status: 'active',
    skills: ['Driving', 'Time Management', 'Customer Service'],
  }
];
