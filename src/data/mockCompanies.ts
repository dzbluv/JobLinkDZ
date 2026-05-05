export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  employees: string;
  size: 'Small' | 'Medium' | 'Large'; // Added size category
  founded: string;
}

export const mockCompanies: Company[] = [
  {
    id: 'c1',
    name: 'TechFlow Algeria',
    logo: 'TF',
    industry: 'Software Development',
    location: 'Algiers, Algeria',
    website: 'https://techflow.dz',
    description: 'TechFlow is the leading software development company in Algeria, specializing in building high-scale web and mobile applications for international markets. We pride ourselves on our innovative culture and commitment to excellence.',
    employees: '50-100',
    size: 'Medium',
    founded: '2015'
  },
  {
    id: 'c2',
    name: 'Creative Studios DZ',
    logo: 'CS',
    industry: 'Design & Creative',
    location: 'Oran, Algeria',
    website: 'https://creativestudios.dz',
    description: 'Creative Studios is a premier design agency that brings together the best creative minds in Oran. We focus on delivering exceptional UI/UX designs and branding solutions for startups and established enterprises.',
    employees: '20-50',
    size: 'Small',
    founded: '2018'
  },
  {
    id: 'c3',
    name: 'DataScale solutions',
    logo: 'DS',
    industry: 'IT Infrastructure',
    location: 'Algiers, Algeria',
    website: 'https://datascale.dz',
    description: 'DataScale focuses on server-side technologies, cloud infrastructure, and data analytics. We help businesses scale their digital presence with robust and secure backend solutions.',
    employees: '30-60',
    size: 'Small',
    founded: '2017'
  },
  {
    id: 'c4',
    name: 'Global Brands',
    logo: 'GB',
    industry: 'Marketing & Advertising',
    location: 'Constantine, Algeria',
    website: 'https://globalbrands.dz',
    description: 'Global Brands is an integrated marketing communications agency. We specialize in digital marketing, brand strategy, and consumer engagement across various industrial sectors.',
    employees: '15-30',
    size: 'Small',
    founded: '2012'
  },
  {
    id: 'c5',
    name: 'Uno Hypermarket',
    logo: 'UH',
    industry: 'Retail & Supermarkets',
    location: 'Setif, Algeria',
    website: 'https://uno.dz',
    description: 'Uno Hypermarket is one of the largest retail chains in Algeria, providing fresh goods, electronics, and household items to millions of customers daily.',
    employees: '500-1000',
    size: 'Large',
    founded: '2008'
  },
  {
    id: 'c6',
    name: 'Logistics Pro DZ',
    logo: 'LP',
    industry: 'Supply Chain & Logistics',
    location: 'Blida, Algeria',
    website: 'https://logisticspro.dz',
    description: 'Logistics Pro offers comprehensive supply chain solutions, from warehousing to national distribution networks, ensuring quick and secure delivery across the country.',
    employees: '100-250',
    size: 'Medium',
    founded: '2016'
  },
  {
    id: 'c7',
    name: 'Yassir Express',
    logo: 'YE',
    industry: 'Transportation & Delivery',
    location: 'Annaba, Algeria',
    website: 'https://yassir.dz',
    description: 'Yassir Express revolutionized the delivery and ride-hailing market in Algeria. We connect drivers, couriers, and customers through a seamless digital experience.',
    employees: '1000+',
    size: 'Large',
    founded: '2017'
  }
];
