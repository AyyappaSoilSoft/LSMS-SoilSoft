import { Worker, Factory, User, Invoice, Alert, AdminAction, WageUpdate, Performance } from './types';

// Mock data for workers
export const workers: Worker[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-0123',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15,
    startDate: '2023-01-15',
    department: 'Production'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0124',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16,
    startDate: '2023-02-01',
    department: 'Assembly'
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '555-0125',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.5,
    startDate: '2023-03-15',
    department: 'Quality Control'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '555-0126',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15,
    startDate: '2023-04-01',
    department: 'Production'
  },
  {
    id: '5',
    name: 'Michael Lee',
    email: 'michael.lee@example.com',
    phone: '555-0127',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16.5,
    startDate: '2023-05-15',
    department: 'Assembly'
  },
  {
    id: '6',
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '555-0128',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.75,
    startDate: '2023-06-01',
    department: 'Quality Control'
  },
  {
    id: '7',
    name: 'James Rodriguez',
    email: 'james.rodriguez@example.com',
    phone: '555-0129',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16,
    startDate: '2023-07-15',
    department: 'Production'
  },
  {
    id: '8',
    name: 'Lisa Kim',
    email: 'lisa.kim@example.com',
    phone: '555-0130',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.5,
    startDate: '2023-08-01',
    department: 'Assembly'
  },
  {
    id: '9',
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    phone: '555-0131',
    factory: 'Factory B',
    role: 'Worker',
    status: 'inactive',
    supervisor: 'James Brown',
    hourlyRate: 16,
    startDate: '2023-09-15',
    department: 'Quality Control'
  },
  {
    id: '10',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@example.com',
    phone: '555-0132',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.25,
    startDate: '2023-10-01',
    department: 'Production'
  },
  {
    id: '11',
    name: 'William Brown',
    email: 'william.brown@example.com',
    phone: '555-0133',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16.25,
    startDate: '2023-11-15',
    department: 'Assembly'
  },
  {
    id: '12',
    name: 'Jessica Wong',
    email: 'jessica.wong@example.com',
    phone: '555-0134',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.5,
    startDate: '2023-12-01',
    department: 'Quality Control'
  },
  {
    id: '13',
    name: 'Daniel Park',
    email: 'daniel.park@example.com',
    phone: '555-0135',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16,
    startDate: '2024-01-15',
    department: 'Production'
  },
  {
    id: '14',
    name: 'Amanda White',
    email: 'amanda.white@example.com',
    phone: '555-0136',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.75,
    startDate: '2024-02-01',
    department: 'Assembly'
  },
  {
    id: '15',
    name: 'Christopher Lee',
    email: 'christopher.lee@example.com',
    phone: '555-0137',
    factory: 'Factory B',
    role: 'Worker',
    status: 'inactive',
    supervisor: 'James Brown',
    hourlyRate: 16.5,
    startDate: '2023-03-15',
    department: 'Quality Control'
  },
  {
    id: '16',
    name: 'Michelle Nguyen',
    email: 'michelle.nguyen@example.com',
    phone: '555-0138',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.25,
    startDate: '2024-01-01',
    department: 'Production'
  },
  {
    id: '17',
    name: 'Kevin Chang',
    email: 'kevin.chang@example.com',
    phone: '555-0139',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16,
    startDate: '2024-01-15',
    department: 'Assembly'
  },
  {
    id: '18',
    name: 'Rachel Green',
    email: 'rachel.green@example.com',
    phone: '555-0140',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.5,
    startDate: '2024-02-01',
    department: 'Quality Control'
  },
  {
    id: '19',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    phone: '555-0141',
    factory: 'Factory B',
    role: 'Worker',
    status: 'active',
    supervisor: 'James Brown',
    hourlyRate: 16.25,
    startDate: '2024-02-15',
    department: 'Production'
  },
  {
    id: '20',
    name: 'Sofia Patel',
    email: 'sofia.patel@example.com',
    phone: '555-0142',
    factory: 'Factory A',
    role: 'Worker',
    status: 'active',
    supervisor: 'Sarah Wilson',
    hourlyRate: 15.75,
    startDate: '2024-03-01',
    department: 'Assembly'
  }
];

// Mock data for factories
export const factories: Factory[] = [
  {
    id: '1',
    name: 'Factory A',
    location: '123 Industrial Ave, Manufacturing District',
    supervisor: 'Sarah Wilson',
    workers: 50,
    status: 'active',
    capacity: 100,
    operatingHours: {
      start: '08:00',
      end: '17:00'
    },
    departments: ['Production', 'Assembly', 'Quality Control'],
    contactDetails: {
      phone: '555-0100',
      email: 'factory.a@example.com',
      address: '123 Industrial Ave, Manufacturing District, Industrial City, 12345'
    },
    facilities: [
      'Main Production Hall',
      'Assembly Line A',
      'Assembly Line B',
      'Quality Control Lab',
      'Worker Break Room',
      'Storage Warehouse'
    ],
    equipmentCount: 75,
    safetyRating: 95,
    certifications: [
      'ISO 9001:2015',
      'OHSAS 18001',
      'Environmental Management ISO 14001'
    ],
    monthlyCapacity: 10000,
    yearEstablished: 2020
  },
  {
    id: '2',
    name: 'Factory B',
    location: '456 Manufacturing Blvd, Industrial Zone',
    supervisor: 'James Brown',
    workers: 75,
    status: 'active',
    capacity: 150,
    operatingHours: {
      start: '07:00',
      end: '16:00'
    },
    departments: ['Production', 'Assembly', 'Quality Control'],
    contactDetails: {
      phone: '555-0200',
      email: 'factory.b@example.com',
      address: '456 Manufacturing Blvd, Industrial Zone, Factory City, 12346'
    },
    facilities: [
      'Production Hall A',
      'Production Hall B',
      'High-Speed Assembly Line',
      'Quality Control Center',
      'Worker Cafeteria',
      'Raw Material Storage',
      'Finished Goods Warehouse'
    ],
    equipmentCount: 100,
    safetyRating: 92,
    certifications: [
      'ISO 9001:2015',
      'ISO 45001:2018',
      'Energy Management ISO 50001'
    ],
    monthlyCapacity: 15000,
    yearEstablished: 2019
  },
  {
    id: '3',
    name: 'Factory C',
    location: '789 Production Road, Tech Park',
    supervisor: 'Michael Chen',
    workers: 60,
    status: 'active',
    capacity: 120,
    operatingHours: {
      start: '06:00',
      end: '15:00'
    },
    departments: ['Production', 'Assembly', 'Quality Control', 'R&D'],
    contactDetails: {
      phone: '555-0300',
      email: 'factory.c@example.com',
      address: '789 Production Road, Tech Park, Innovation City, 12347'
    },
    facilities: [
      'Advanced Production Center',
      'Automated Assembly Line',
      'R&D Laboratory',
      'Quality Testing Facility',
      'Employee Recreation Center',
      'Climate-Controlled Storage'
    ],
    equipmentCount: 90,
    safetyRating: 97,
    certifications: [
      'ISO 9001:2015',
      'ISO 13485:2016',
      'Green Manufacturing Certification'
    ],
    monthlyCapacity: 12000,
    yearEstablished: 2021
  },
  {
    id: '4',
    name: 'Factory D',
    location: '321 Innovation Way, Smart Industrial Park',
    supervisor: 'Emily Rodriguez',
    workers: 85,
    status: 'active',
    capacity: 180,
    operatingHours: {
      start: '07:30',
      end: '16:30'
    },
    departments: ['Production', 'Assembly', 'Quality Control', 'Automation'],
    contactDetails: {
      phone: '555-0400',
      email: 'factory.d@example.com',
      address: '321 Innovation Way, Smart Industrial Park, Future City, 12348'
    },
    facilities: [
      'Smart Manufacturing Center',
      'IoT-Enabled Assembly Lines',
      'Automated Quality Control',
      'Digital Twin Lab',
      'Modern Cafeteria',
      'Smart Warehouse',
      'Training Center'
    ],
    equipmentCount: 120,
    safetyRating: 98,
    certifications: [
      'ISO 9001:2015',
      'Industry 4.0 Certification',
      'Smart Factory Standard',
      'Green Energy Certification'
    ],
    monthlyCapacity: 20000,
    yearEstablished: 2022
  },
  {
    id: '5',
    name: 'Factory E',
    location: '654 Sustainable Drive, Green Industrial Zone',
    supervisor: 'David Kim',
    workers: 70,
    status: 'active',
    capacity: 140,
    operatingHours: {
      start: '08:30',
      end: '17:30'
    },
    departments: ['Production', 'Assembly', 'Quality Control', 'Sustainability'],
    contactDetails: {
      phone: '555-0500',
      email: 'factory.e@example.com',
      address: '654 Sustainable Drive, Green Industrial Zone, Eco City, 12349'
    },
    facilities: [
      'Eco-Friendly Production Hall',
      'Solar-Powered Assembly Lines',
      'Green Quality Control Center',
      'Recycling Center',
      'Sustainable Break Room',
      'Energy-Efficient Warehouse',
      'Environmental Research Lab'
    ],
    equipmentCount: 85,
    safetyRating: 96,
    certifications: [
      'ISO 9001:2015',
      'ISO 14001:2015',
      'Green Manufacturing Excellence',
      'Carbon Neutral Certification'
    ],
    monthlyCapacity: 13000,
    yearEstablished: 2023
  }
];

// Mock data for users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'supervisor',
    status: 'active',
    factory: 'Factory A'
  },
  {
    id: '3',
    name: 'James Brown',
    email: 'james.brown@example.com',
    role: 'supervisor',
    status: 'active',
    factory: 'Factory B'
  }
];

// Mock data for invoices
export const invoices: Invoice[] = [
  {
    id: '1',
    factory: 'Factory A',
    amount: 45678,
    status: 'pending',
    dueDate: '2024-03-30',
    createdAt: '2024-03-01',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '2',
    factory: 'Factory B',
    amount: 34567,
    status: 'overdue',
    dueDate: '2024-03-15',
    createdAt: '2024-02-15',
    paymentMethod: 'check'
  }
];

// Mock data for alerts
export const alerts: Alert[] = [
  {
    id: '1',
    type: 'Late Check-in',
    message: 'Multiple workers reported late at Factory A',
    severity: 'medium',
    factory: 'Factory A',
    createdAt: '2024-03-20T08:30:00',
    status: 'new'
  },
  {
    id: '2',
    type: 'Performance Issue',
    message: 'Production rate below target at Factory B',
    severity: 'high',
    factory: 'Factory B',
    createdAt: '2024-03-20T10:15:00',
    status: 'acknowledged'
  }
];

// Mock data for admin actions
export const adminActions: AdminAction[] = [
  {
    id: '1',
    type: 'create',
    resource: 'worker',
    details: 'Created new worker: John Smith',
    performedBy: 'Admin User',
    timestamp: '2024-03-20T09:00:00'
  },
  {
    id: '2',
    type: 'update',
    resource: 'factory',
    details: 'Updated Factory A capacity',
    performedBy: 'Admin User',
    timestamp: '2024-03-20T10:30:00'
  }
];

// Mock data for wage updates
export const wageUpdates: WageUpdate[] = [
  {
    id: '1',
    workerId: '1',
    oldRate: 14,
    newRate: 15,
    effectiveDate: '2024-03-01',
    approvedBy: 'Sarah Wilson'
  },
  {
    id: '2',
    workerId: '2',
    oldRate: 15,
    newRate: 16,
    effectiveDate: '2024-03-01',
    approvedBy: 'James Brown'
  }
];

// Mock data for performance records
export const performance: Performance[] = [
  {
    id: '1',
    workerId: '1',
    date: '2024-03-01',
    rating: 4.5,
    comments: 'Excellent work quality and team collaboration',
    submittedBy: 'Sarah Wilson'
  },
  {
    id: '2',
    workerId: '2',
    date: '2024-03-01',
    rating: 4.0,
    comments: 'Good performance, meeting all targets',
    submittedBy: 'James Brown'
  }
];