export interface Issue {
  id: string;
  category: string;
  department: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  location: string;
  date: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  description: string;
  imageUrl?: string;
  assignedTo?: string;
  notes: string[];
  resolutionTime?: number; // in hours
}

export interface Department {
  id: string;
  name: string;
  totalIssues: number;
  openIssues: number;
  avgResolutionTime: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}

export const mockIssues: Issue[] = [
  {
    id: 'ISS001',
    category: 'Pothole',
    department: 'Public Works',
    status: 'Open',
    priority: 'High',
    location: 'Main St & 5th Ave',
    date: '2024-01-15',
    citizenName: 'John Smith',
    citizenEmail: 'john.smith@email.com',
    citizenPhone: '(555) 123-4567',
    description: 'Large pothole causing traffic issues',
    notes: ['Reported by multiple citizens', 'High traffic area'],
  },
  {
    id: 'ISS002',
    category: 'Street Light',
    department: 'Public Works',
    status: 'In Progress',
    priority: 'Medium',
    location: 'Oak Park',
    date: '2024-01-12',
    citizenName: 'Mary Johnson',
    citizenEmail: 'mary.j@email.com',
    citizenPhone: '(555) 234-5678',
    description: 'Street light not working',
    assignedTo: 'Mike Wilson',
    notes: ['Parts ordered', 'Scheduled for repair'],
    resolutionTime: 48,
  },
  {
    id: 'ISS003',
    category: 'Garbage Collection',
    department: 'Sanitation',
    status: 'Resolved',
    priority: 'Medium',
    location: 'Elm Street Residential',
    date: '2024-01-10',
    citizenName: 'Robert Davis',
    citizenEmail: 'r.davis@email.com',
    citizenPhone: '(555) 345-6789',
    description: 'Missed garbage collection for two weeks',
    assignedTo: 'Sarah Brown',
    notes: ['Route updated', 'Collection resumed'],
    resolutionTime: 24,
  },
  {
    id: 'ISS004',
    category: 'Water Leak',
    department: 'Water Department',
    status: 'Open',
    priority: 'High',
    location: 'Center Plaza',
    date: '2024-01-14',
    citizenName: 'Lisa Wilson',
    citizenEmail: 'lisa.w@email.com',
    citizenPhone: '(555) 456-7890',
    description: 'Water leak on sidewalk',
    notes: ['Emergency priority', 'Affecting pedestrian traffic'],
  },
  {
    id: 'ISS005',
    category: 'Park Maintenance',
    department: 'Parks & Recreation',
    status: 'In Progress',
    priority: 'Low',
    location: 'Sunset Park',
    date: '2024-01-08',
    citizenName: 'David Lee',
    citizenEmail: 'd.lee@email.com',
    citizenPhone: '(555) 567-8901',
    description: 'Broken playground equipment',
    assignedTo: 'Tom Garcia',
    notes: ['Safety inspection completed', 'Replacement parts ordered'],
    resolutionTime: 72,
  },
];

export const mockDepartments: Department[] = [
  { id: '1', name: 'Public Works', totalIssues: 45, openIssues: 15, avgResolutionTime: 36 },
  { id: '2', name: 'Sanitation', totalIssues: 32, openIssues: 8, avgResolutionTime: 24 },
  { id: '3', name: 'Water Department', totalIssues: 28, openIssues: 12, avgResolutionTime: 18 },
  { id: '4', name: 'Parks & Recreation', totalIssues: 19, openIssues: 5, avgResolutionTime: 48 },
  { id: '5', name: 'Street Lighting', totalIssues: 15, openIssues: 3, avgResolutionTime: 30 },
];

export const mockStaff: StaffMember[] = [
  { id: '1', name: 'Mike Wilson', role: 'Senior Technician', department: 'Public Works', email: 'mike.w@city.gov', phone: '(555) 111-2222' },
  { id: '2', name: 'Sarah Brown', role: 'Supervisor', department: 'Sanitation', email: 'sarah.b@city.gov', phone: '(555) 333-4444' },
  { id: '3', name: 'Tom Garcia', role: 'Maintenance Lead', department: 'Parks & Recreation', email: 'tom.g@city.gov', phone: '(555) 555-6666' },
  { id: '4', name: 'Amy Chen', role: 'Engineer', department: 'Water Department', email: 'amy.c@city.gov', phone: '(555) 777-8888' },
  { id: '5', name: 'Carlos Rodriguez', role: 'Electrician', department: 'Street Lighting', email: 'carlos.r@city.gov', phone: '(555) 999-0000' },
];

export const chartData = {
  departmentStats: [
    { name: 'Public Works', issues: 45, resolved: 30 },
    { name: 'Sanitation', issues: 32, resolved: 24 },
    { name: 'Water Dept', issues: 28, resolved: 16 },
    { name: 'Parks & Rec', issues: 19, resolved: 14 },
    { name: 'Lighting', issues: 15, resolved: 12 },
  ],
  categoryDistribution: [
    { name: 'Potholes', value: 35, color: '#3B82F6' },
    { name: 'Garbage', value: 25, color: '#10B981' },
    { name: 'Lighting', value: 20, color: '#F59E0B' },
    { name: 'Water', value: 15, color: '#EF4444' },
    { name: 'Parks', value: 5, color: '#8B5CF6' },
  ],
  trendData: [
    { month: 'Oct', reported: 120, resolved: 110 },
    { month: 'Nov', reported: 135, resolved: 125 },
    { month: 'Dec', reported: 140, resolved: 135 },
    { month: 'Jan', reported: 155, resolved: 145 },
  ],
  resolutionTimes: [
    { range: '0-6h', count: 25 },
    { range: '6-12h', count: 40 },
    { range: '12-24h', count: 35 },
    { range: '24-48h', count: 20 },
    { range: '48h+', count: 15 },
  ],
};