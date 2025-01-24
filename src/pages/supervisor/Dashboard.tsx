import React, { useState } from 'react';
import { Users, AlertTriangle, CheckCircle, FileText, Clock, UserCheck } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { workers } from '../../lib/data';

// Performance Review Schema
const performanceSchema = z.object({
  workerId: z.string().min(1, 'Worker is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  feedback: z.string().min(10, 'Please provide detailed feedback'),
});

type PerformanceFormData = z.infer<typeof performanceSchema>;

// Leave Request Schema
const leaveRequestSchema = z.object({
  workerId: z.string().min(1, 'Worker is required'),
  status: z.enum(['approved', 'rejected']),
  comment: z.string().optional(),
});

type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

interface WorkerStatus {
  id: number;
  name: string;
  status: 'present' | 'absent' | 'late';
  checkIn: string;
  performance: string;
}

interface LeaveRequest {
  id: string;
  workerName: string;
  dates: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function SupervisorDashboard() {
  // State for modals
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);

  // Form handlers
  const performanceForm = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
  });

  const leaveForm = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
  });

  // Mock data
  const [workerStatuses] = useState<WorkerStatus[]>(
    workers.map((worker, index) => ({
      id: index + 1,
      name: worker.name,
      status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'late' : 'absent',
      checkIn: '09:00 AM',
      performance: 'Good',
    }))
  );

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      workerName: 'John Doe',
      dates: 'Mar 25 - Mar 27',
      reason: 'Family emergency',
      status: 'pending',
    },
    {
      id: '2',
      workerName: 'Jane Smith',
      dates: 'Mar 28 - Mar 29',
      reason: 'Medical appointment',
      status: 'pending',
    },
  ]);

  // Handlers for Performance Review
  const handlePerformanceSubmit = (data: PerformanceFormData) => {
    console.log('Performance review submitted:', data);
    // Here you would typically send this to your backend
    setIsPerformanceModalOpen(false);
    performanceForm.reset();
  };

  // Handlers for Leave Requests
  const handleLeaveAction = (request: LeaveRequest) => {
    setSelectedLeaveRequest(request);
    setIsLeaveModalOpen(true);
  };

  const handleLeaveDecision = (data: LeaveRequestFormData) => {
    if (!selectedLeaveRequest) return;

    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === selectedLeaveRequest.id
          ? { ...req, status: data.status }
          : req
      )
    );

    setIsLeaveModalOpen(false);
    setSelectedLeaveRequest(null);
    leaveForm.reset();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'present' ? 'bg-green-100 text-green-800' :
          value === 'late' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'checkIn', label: 'Check In Time' },
    { key: 'performance', label: 'Performance' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
        <p className="text-gray-600">Overview of team attendance and performance</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Users className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Workers</h3>
          <p className="text-2xl font-semibold mt-1">{workerStatuses.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Present Today</h3>
          <p className="text-2xl font-semibold mt-1">
            {workerStatuses.filter(w => w.status === 'present').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <AlertTriangle className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Late Check-ins</h3>
          <p className="text-2xl font-semibold mt-1">
            {workerStatuses.filter(w => w.status === 'late').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FileText className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Pending Leaves</h3>
          <p className="text-2xl font-semibold mt-1">
            {leaveRequests.filter(r => r.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Today's Attendance</h2>
        <DataTable columns={columns} data={workerStatuses} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Input */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Input</h2>
          <div className="space-y-4">
            <button
              onClick={() => setIsPerformanceModalOpen(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Performance Review
            </button>
            <button
              onClick={() => window.location.href = '/performance'}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              View Past Reviews
            </button>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>
          <div className="space-y-4">
            {leaveRequests
              .filter(request => request.status === 'pending')
              .map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{request.workerName}</p>
                    <p className="text-sm text-gray-500">{request.dates}</p>
                    <p className="text-sm text-gray-500">{request.reason}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLeaveAction(request)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            {leaveRequests.filter(r => r.status === 'pending').length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending leave requests</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Review Modal */}
      <Modal
        isOpen={isPerformanceModalOpen}
        onClose={() => {
          setIsPerformanceModalOpen(false);
          performanceForm.reset();
        }}
        title="Add Performance Review"
      >
        <form onSubmit={performanceForm.handleSubmit(handlePerformanceSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Worker</label>
            <select
              {...performanceForm.register('workerId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a worker</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
            {performanceForm.formState.errors.workerId && (
              <p className="mt-1 text-sm text-red-600">
                {performanceForm.formState.errors.workerId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              {...performanceForm.register('rating', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {performanceForm.formState.errors.rating && (
              <p className="mt-1 text-sm text-red-600">
                {performanceForm.formState.errors.rating.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              {...performanceForm.register('feedback')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {performanceForm.formState.errors.feedback && (
              <p className="mt-1 text-sm text-red-600">
                {performanceForm.formState.errors.feedback.message}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPerformanceModalOpen(false);
                performanceForm.reset();
              }}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Leave Request Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => {
          setIsLeaveModalOpen(false);
          setSelectedLeaveRequest(null);
          leaveForm.reset();
        }}
        title="Review Leave Request"
      >
        {selectedLeaveRequest && (
          <form onSubmit={leaveForm.handleSubmit(handleLeaveDecision)} className="space-y-4">
            <div>
              <h3 className="font-medium">Request Details</h3>
              <p className="text-sm text-gray-600">Worker: {selectedLeaveRequest.workerName}</p>
              <p className="text-sm text-gray-600">Dates: {selectedLeaveRequest.dates}</p>
              <p className="text-sm text-gray-600">Reason: {selectedLeaveRequest.reason}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Decision</label>
              <select
                {...leaveForm.register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select decision</option>
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </select>
              {leaveForm.formState.errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {leaveForm.formState.errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Comment (Optional)</label>
              <textarea
                {...leaveForm.register('comment')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Submit Decision
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLeaveModalOpen(false);
                  setSelectedLeaveRequest(null);
                  leaveForm.reset();
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}