import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const leaveSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Please provide a detailed reason'),
  type: z.enum(['sick', 'vacation', 'personal', 'other']),
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
}

export default function WorkerLeave() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  });

  // Mock leave requests
  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      startDate: '2024-03-25',
      endDate: '2024-03-27',
      type: 'vacation',
      reason: 'Family vacation',
      status: 'pending',
      submittedAt: '2024-03-20',
    },
    {
      id: '2',
      startDate: '2024-04-10',
      endDate: '2024-04-12',
      type: 'sick',
      reason: 'Medical appointment',
      status: 'approved',
      submittedAt: '2024-03-15',
    },
  ];

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
    { key: 'reason', label: 'Reason' },
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
  ];

  const onSubmit = (data: LeaveFormData) => {
    console.log('Leave request:', data);
    setIsModalOpen(false);
    reset();
  };

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
          <h3 className="text-gray-500 text-sm font-medium">Total Leave Days</h3>
          <p className="text-2xl font-semibold mt-1">20</p>
          <p className="text-sm text-gray-500">Annual allocation</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Used Days</h3>
          <p className="text-2xl font-semibold mt-1">8</p>
          <p className="text-sm text-gray-500">This year</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Clock className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
          <p className="text-2xl font-semibold mt-1">1</p>
          <p className="text-sm text-gray-500">Awaiting approval</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <XCircle className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Remaining Days</h3>
          <p className="text-2xl font-semibold mt-1">12</p>
          <p className="text-sm text-gray-500">Available to use</p>
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
              <option value="other">Other</option>
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
    </div>
  );
}