// Base types
export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  factory: string;
  role: string;
  status: 'active' | 'inactive';
  supervisor?: string;
  hourlyRate: number;
  startDate: string;
  language?: string;
  checkInTime?: string;
  checkOutTime?: string;
  department?: string;
  emergencyContact?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  supervisor: string;
  workers: number;
  status: 'active' | 'inactive';
  capacity: number;
  operatingHours: {
    start: string;
    end: string;
  };
  departments: string[];
  contactDetails: {
    phone: string;
    email: string;
    address: string;
  };
  facilities: string[];
  equipmentCount: number;
  safetyRating: number;
  certifications: string[];
  monthlyCapacity: number;
  yearEstablished: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'manager' | 'worker' | 'accountant';
  status: 'active' | 'inactive';
  factory?: string;
  language?: string;
}

export interface Invoice {
  id: string;
  factory: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  paymentDate?: string;
  paymentMethod?: 'bank_transfer' | 'check' | 'cash';
  reference?: string;
  notes?: string;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  factory: string;
  createdAt: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface LeaveRequest {
  id: string;
  workerId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

export interface Performance {
  id: string;
  workerId: string;
  date: string;
  rating: number;
  comments: string;
  submittedBy: string;
}

export interface AdminAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface WageUpdate {
  id: string;
  workerId: string;
  oldRate: number;
  newRate: number;
  effectiveDate: string;
  approvedBy: string;
}