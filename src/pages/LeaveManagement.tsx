import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, CheckCircle, XCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const remarkSchema = z.object({
  supervisorId: z.string().min(1, 'Supervisor is required'),
  type: z.enum(['performance', 'management', 'issue', 'other']),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

const leaveActionSchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
  notifyBackup: z.boolean().default(true),
});

type RemarkFormData = z.infer<typeof remarkSchema>;
type LeaveActionFormData = z.infer<typeof leaveActionSchema>;

interface LeaveRequest {
  id: string;
  supervisorName: string;
  factory: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  backupSupervisor: string;
  criticalTasks: string;
  handover: string;
  adminComment?: string;
  actionDate?: string;
}

interface Remark {
  id: string;
  supervisorName: string;
  type: string;
  subject: string;
  message: string;
  priority: string;
  createdAt: string;
  status: 'unread' | 'read' | 'acknowledged';
}

export default function LeaveManagement() {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaveFilter, setLeaveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      supervisorName: 'Sarah Wilson',
      factory: 'Factory A',
      startDate: '2024-03-25',
      endDate: '2024-03-27',
      type: 'vacation',
      reason: 'Family vacation',
      status: 'pending',
      submittedAt: '2024-03-20',
      backupSupervisor: 'James Brown',
      criticalTasks: 'Monthly performance reviews due on March 30th',
      handover: 'All ongoing projects documented in shared drive'
    },
    {
      id: '2',
      supervisorName: 'James Brown',
      factory: 'Factory B',
      startDate: '2024-04-01',
      endDate: '2024-04-03',
      type: 'personal',
      reason: 'Medical appointment',
      status: 'pending',
      submittedAt: '2024-03-19',
      backupSupervisor: 'Michael Chen',
      criticalTasks: 'Project milestone on April 5th',
      handover: 'Detailed handover notes shared via email'
    }
  ]);

  const { register: remarkRegister, handleSubmit: handleRemarkSubmit, reset: resetRemark, formState: { errors: remarkErrors } } = useForm<RemarkFormData>({
    resolver: zodResolver(remarkSchema),
  });

  const { register: actionRegister, handleSubmit: handleActionSubmit, reset: resetAction, formState: { errors: actionErrors } } = useForm<LeaveActionFormData>({
    resolver: zodResolver(leaveActionSchema),
    defaultValues: {
      notifyBackup: true
    }
  });

  const [remarks] = useState<Remark[]>([
    {
      id: '1',
      supervisorName: 'Sarah Wilson',
      type: 'performance',
      subject: 'Team Performance Review',
      message: 'Great job on improving team productivity this quarter.',
      priority: 'medium',
      createdAt: '2024-03-20',
      status: 'unread'
    },
    {
      id: '2',
      supervisorName: 'James Brown',
      type: 'issue',
      subject: 'Safety Concerns',
      message: 'Please address the safety issues raised by factory owner.',
      priority: 'high',
      createdAt: '2024-03-19',
      status: 'read'
    }
  ]);

  const leaveColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'factory', label: 'Factory' },
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
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedLeave(leave);
              setIsLeaveModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Review
          </button>
        </div>
      )
    }
  ];

  const remarkColumns = [
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'subject', label: 'Subject' },
    { key: 'type', label: 'Type' },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'high' ? 'bg-red-100 text-red-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'unread' ? 'bg-red-100 text-red-800' :
          value === 'read' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const handleLeaveAction = async (action: 'approve' | 'reject', data: LeaveActionFormData) => {
    if (!selectedLeave) return;
    
    // Update the leave request status
    setLeaveRequests(prev => prev.map(request => 
      request.id === selectedLeave.id
        ? {
            ...request,
            status: action === 'approve' ? 'approved' : 'rejected',
            adminComment: data.comment,
            actionDate: new Date().toISOString()
          }
        : request
    ));

    // In a real app, you would also:
    // 1. Send notification to the supervisor
    // 2. Send notification to the backup supervisor if notifyBackup is true
    // 3. Update database records
    console.log(`${action}ing leave request:`, {
      leaveId: selectedLeave.id,
      action,
      comment: data.comment,
      notifyBackup: data.notifyBackup
    });
    
    setIsLeaveModalOpen(false);
    setSelectedLeave(null);
    resetAction();
  };

  const handleRemarkSubmission = async (data: RemarkFormData) => {
    // In a real app, this would be an API call
    console.log('Sending remark:', data);
    
    setIsRemarkModalOpen(false);
    resetRemark();
  };

  const filteredLeaveRequests = leaveRequests.filter(request => 
    leaveFilter === 'all' || request.status === leaveFilter
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Management</h1>
        <button
          onClick={() => setIsRemarkModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send Supervisor Remark
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Calendar className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Requests</h3>
          <p className="text-2xl font-semibold mt-1">{leaveRequests.length}</p>
          <p className="text-sm text-gray-500">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Clock className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
          <p className="text-2xl font-semibold mt-1">
            {leaveRequests.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-500">Awaiting review</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <MessageSquare className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Unread Remarks</h3>
          <p className="text-2xl font-semibold mt-1">
            {remarks.filter(r => r.status === 'unread').length}
          </p>
          <p className="text-sm text-gray-500">Pending acknowledgment</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <AlertTriangle className="w-8 h-8 mb-2 text-red-600" />
          <h3 className="text-gray-500 text-sm font-medium">High Priority</h3>
          <p className="text-2xl font-semibold mt-1">
            {remarks.filter(r => r.priority === 'high').length}
          </p>
          <p className="text-sm text-gray-500">Requires attention</p>
        </div>
      </div>

      {/* Leave Requests Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Supervisor Leave Requests</h2>
          <select
            value={leaveFilter}
            onChange={(e) => setLeaveFilter(e.target.value as any)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <DataTable columns={leaveColumns} data={filteredLeaveRequests} />
      </div>

      {/* Recent Remarks Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Remarks</h2>
        <DataTable columns={remarkColumns} data={remarks} />
      </div>

      {/* Leave Review Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => {
          setIsLeaveModalOpen(false);
          setSelectedLeave(null);
          resetAction();
        }}
        title="Review Leave Request"
      >
        {selectedLeave && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{selectedLeave.supervisorName}</h3>
                  <p className="text-sm text-gray-600">{selectedLeave.factory}</p>
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
              <h4 className="font-medium mb-2">Leave Details</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Type:</strong> {selectedLeave.type}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Backup Arrangements</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Backup Supervisor:</strong> {selectedLeave.backupSupervisor}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Handover Notes:</strong> {selectedLeave.handover}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Critical Tasks</h4>
              <p className="text-sm text-gray-600">
                {selectedLeave.criticalTasks}
              </p>
            </div>

            {selectedLeave.status === 'pending' && (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    {...actionRegister('comment')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add your comments about this leave request..."
                  />
                  {actionErrors.comment && (
                    <p className="mt-1 text-sm text-red-600">
                      {actionErrors.comment.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...actionRegister('notifyBackup')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Notify backup supervisor ({selectedLeave.backupSupervisor})
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleActionSubmit((data) => handleLeaveAction('approve', data))}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={handleActionSubmit((data) => handleLeaveAction('reject', data))}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </form>
            )}

            {selectedLeave.status !== 'pending' && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Action Details</h4>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedLeave.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedLeave.status}
                  </span>
                </p>
                {selectedLeave.adminComment && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Comment:</strong> {selectedLeave.adminComment}
                  </p>
                )}
                {selectedLeave.actionDate && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Action Date:</strong>{' '}
                    {new Date(selectedLeave.actionDate).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Send Remark Modal */}
      <Modal
        isOpen={isRemarkModalOpen}
        onClose={() => {
          setIsRemarkModalOpen(false);
          resetRemark();
        }}
        title="Send Supervisor Remark"
      >
        <form onSubmit={handleRemarkSubmit(handleRemarkSubmission)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Supervisor</label>
            <select
              {...remarkRegister('supervisorId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select supervisor</option>
              <option value="1">Sarah Wilson</option>
              <option value="2">James Brown</option>
              <option value="3">Michael Chen</option>
            </select>
            {remarkErrors.supervisorId && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.supervisorId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...remarkRegister('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="performance">Performance</option>
              <option value="management">Management</option>
              <option value="issue">Issue</option>
              <option value="other">Other</option>
            </select>
            {remarkErrors.type && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              {...remarkRegister('priority')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {remarkErrors.priority && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.priority.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              {...remarkRegister('subject')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {remarkErrors.subject && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              {...remarkRegister('message')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {remarkErrors.message && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.message.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Send Remark
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRemarkModalOpen(false);
                resetRemark();
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