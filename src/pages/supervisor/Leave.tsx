import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useAuth } from '../../lib/auth';

const leaveSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Please provide a detailed reason'),
  type: z.enum(['sick', 'vacation', 'personal', 'emergency']),
  handover: z.string().min(10, 'Please provide handover details'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  backupSupervisor: z.string().min(1, 'Backup supervisor is required'),
  criticalTasks: z.string().min(10, 'Please list any critical tasks or deadlines'),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  handover: string;
  contactNumber: string;
  backupSupervisor: string;
  criticalTasks: string;
  approver?: string;
  approvalDate?: string;
  comments?: string;
}

export default function SupervisorLeave() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  });

  // Mock leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      startDate: '2024-03-25',
      endDate: '2024-03-27',
      type: 'vacation',
      reason: 'Family vacation',
      status: 'pending',
      submittedAt: '2024-03-20',
      handover: 'John Smith will handle daily operations. All ongoing projects documented in shared drive.',
      contactNumber: '555-0123',
      backupSupervisor: 'James Brown',
      criticalTasks: 'Monthly performance reviews due on March 30th. Backup supervisor briefed on process.'
    },
    {
      id: '2',
      startDate: '2024-04-10',
      endDate: '2024-04-12',
      type: 'personal',
      reason: 'Personal appointment',
      status: 'approved',
      submittedAt: '2024-03-15',
      handover: 'Sarah Johnson will oversee team activities. Detailed handover notes shared via email.',
      contactNumber: '555-0123',
      backupSupervisor: 'Michael Chen',
      criticalTasks: 'Project milestone on April 15th. All tasks delegated and documented.',
      approver: 'Admin',
      approvalDate: '2024-03-16',
      comments: 'Approved. Backup arrangements confirmed.'
    },
  ]);

  const columns = [
    { 
      key: 'startDate', 
      label: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'endDate', 
      label: 'End Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { key: 'type', label: 'Type' },
    { key: 'backupSupervisor', label: 'Backup Supervisor' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, leave: LeaveRequest) => (
        <button
          onClick={() => {
            setSelectedLeave(leave);
            setIsDetailsModalOpen(true);
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          View Details
        </button>
      )
    }
  ];

  const onSubmit = async (data: LeaveFormData) => {
    // In a real app, this would send the request to the backend
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsModalOpen(false);
    reset();

    // Notify admin (in a real app, this would be handled by the backend)
    console.log('Notifying admin about supervisor leave request:', {
      supervisor: user?.name,
      dates: `${data.startDate} to ${data.endDate}`,
      handover: data.handover,
      backupSupervisor: data.backupSupervisor,
    });
  };

  const calculateLeaveDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalLeavesTaken = leaveRequests.filter(r => r.status === 'approved').length;
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length;
  const upcomingLeaves = leaveRequests.filter(r => 
    r.status === 'approved' && new Date(r.startDate) > new Date()
  ).length;

  // Mock list of available backup supervisors
  const backupSupervisors = [
    'James Brown',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Wilson'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Request Leave
        </button>
      </div>

      {/* Leave Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Calendar className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Leaves Taken</h3>
          <p className="text-2xl font-semibold mt-1">{totalLeavesTaken}</p>
          <p className="text-sm text-gray-500">This year</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Clock className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
          <p className="text-2xl font-semibold mt-1">{pendingRequests}</p>
          <p className="text-sm text-gray-500">Awaiting admin approval</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Upcoming Leaves</h3>
          <p className="text-2xl font-semibold mt-1">{upcomingLeaves}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <AlertTriangle className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Important Note</h3>
          <p className="text-sm text-gray-500 mt-2">
            Admin approval required for all leave requests
          </p>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>
        <DataTable columns={columns} data={leaveRequests} />
      </div>

      {/* Leave Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Request Leave"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal Leave</option>
              <option value="emergency">Emergency Leave</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Backup Supervisor</label>
            <select
              {...register('backupSupervisor')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select backup supervisor</option>
              {backupSupervisors.map(supervisor => (
                <option key={supervisor} value={supervisor}>
                  {supervisor}
                </option>
              ))}
            </select>
            {errors.backupSupervisor && (
              <p className="mt-1 text-sm text-red-600">{errors.backupSupervisor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              {...register('reason')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Critical Tasks & Deadlines</label>
            <textarea
              {...register('criticalTasks')}
              rows={3}
              placeholder="List any critical tasks, deadlines, or ongoing projects during your absence"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.criticalTasks && (
              <p className="mt-1 text-sm text-red-600">{errors.criticalTasks.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Handover Details</label>
            <textarea
              {...register('handover')}
              rows={3}
              placeholder="Provide detailed handover instructions and arrangements"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.handover && (
              <p className="mt-1 text-sm text-red-600">{errors.handover.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Number</label>
            <input
              type="tel"
              {...register('contactNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
            )}
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <div className="text-sm text-yellow-800">
              <strong>Important Notes:</strong>
              <ul className="list-disc ml-4 mt-2">
                <li>Your leave request will be reviewed by the admin</li>
                <li>Ensure backup supervisor is briefed on all responsibilities</li>
                <li>Document all critical tasks and deadlines</li>
                <li>Provide comprehensive handover instructions</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Leave Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedLeave(null);
        }}
        title="Leave Request Details"
      >
        {selectedLeave && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {selectedLeave.type.charAt(0).toUpperCase() + selectedLeave.type.slice(1)} Leave
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedLeave.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedLeave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedLeave.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Backup Arrangements</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Backup Supervisor:</strong> {selectedLeave.backupSupervisor}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Contact Number:</strong> {selectedLeave.contactNumber}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Critical Tasks & Deadlines</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {selectedLeave.criticalTasks}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Handover Details</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {selectedLeave.handover}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Reason</h4>
              <p className="text-sm text-gray-600">
                {selectedLeave.reason}
              </p>
            </div>

            {selectedLeave.approver && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Approval Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Approved By:</strong> {selectedLeave.approver}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Approval Date:</strong> {new Date(selectedLeave.approvalDate!).toLocaleDateString()}
                </p>
                {selectedLeave.comments && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Comments:</strong> {selectedLeave.comments}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setIsDetailsModalOpen(false);
                setSelectedLeave(null);
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}