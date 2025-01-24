import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { workers, factories, users } from '../lib/data';
import type { Worker } from '../lib/types';
import { Phone, MessageSquare, Bell } from 'lucide-react';

// Update the worker form schema
const workerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  factory: z.string().min(1, 'Factory is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  supervisor: z.string().min(1, 'Supervisor is required'),
  shift: z.string().min(1, 'Shift is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
  bankDetails: z.object({
    accountName: z.string().min(1, 'Account name is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    bankName: z.string().min(1, 'Bank name is required'),
  }),
});

type WorkerFormData = z.infer<typeof workerSchema>;

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.enum(['low', 'medium', 'high']),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export default function LaborManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
  });

  const columns = [
    {
      key: 'select',
      label: '',
      render: (_: any, worker: Worker) => (
        <input
          type="checkbox"
          checked={selectedWorkers.includes(worker.id)}
          onChange={() => handleSelectWorker(worker.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'factory', label: 'Factory' },
    { key: 'role', label: 'Role' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'shift', label: 'Shift' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'hourlyRate', 
      label: 'Hourly Rate',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, worker: Worker) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(worker)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(worker)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
          <button
            onClick={() => window.location.href = `tel:${worker.phone}`}
            className="text-green-600 hover:text-green-800"
          >
            <Phone size={16} />
          </button>
          <button
            onClick={() => window.location.href = `sms:${worker.phone}`}
            className="text-purple-600 hover:text-purple-800"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      )
    }
  ];

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    reset({
      ...worker,
      bankDetails: worker.bankDetails || {
        accountName: '',
        accountNumber: '',
        bankName: '',
      },
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (worker: Worker) => {
    if (window.confirm(`Are you sure you want to delete ${worker.name}?`)) {
      // In a real app, make API call to delete worker
      console.log('Deleting worker:', worker);
    }
  };

  const onSubmit = async (data: WorkerFormData) => {
    if (editingWorker) {
      // In a real app, make API call to update worker
      console.log('Updating worker:', data);
    } else {
      // In a real app, make API call to create worker
      console.log('Creating worker:', data);
    }
    setIsModalOpen(false);
    reset();
  };

  const handleSendNotification = async (data: NotificationFormData) => {
    // In a real app, this would send push notifications to selected workers
    console.log('Sending notification to workers:', selectedWorkers, data);
    setIsNotificationModalOpen(false);
    notificationForm.reset();
  };

  const supervisors = users.filter(user => user.role === 'supervisor');
  const shifts = [
    { id: 'morning', name: 'Morning Shift (6:00 AM - 2:00 PM)' },
    { id: 'afternoon', name: 'Afternoon Shift (2:00 PM - 10:00 PM)' },
    { id: 'night', name: 'Night Shift (10:00 PM - 6:00 AM)' },
    { id: 'general', name: 'General Shift (9:00 AM - 5:00 PM)' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Labor Management</h1>
        <div className="space-x-4">
          <button
            onClick={() => {
              setEditingWorker(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Worker
          </button>
          <button
            onClick={() => setIsNotificationModalOpen(true)}
            disabled={selectedWorkers.length === 0}
            className={`px-4 py-2 rounded-lg ${
              selectedWorkers.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Send Notification ({selectedWorkers.length})
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={workers}
      />

      {/* Add/Edit Worker Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title={editingWorker ? 'Edit Worker' : 'Add Worker'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input
                type="tel"
                {...register('emergencyContact')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.emergencyContact && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.message}</p>
              )}
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Work Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Factory</label>
              <select
                {...register('factory')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select factory</option>
                {factories.map(factory => (
                  <option key={factory.id} value={factory.name}>
                    {factory.name}
                  </option>
                ))}
              </select>
              {errors.factory && (
                <p className="mt-1 text-sm text-red-600">{errors.factory.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                {...register('department')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                <option value="Production">Production</option>
                <option value="Assembly">Assembly</option>
                <option value="Quality Control">Quality Control</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supervisor</label>
              <select
                {...register('supervisor')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select supervisor</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor.id} value={supervisor.name}>
                    {supervisor.name}
                  </option>
                ))}
              </select>
              {errors.supervisor && (
                <p className="mt-1 text-sm text-red-600">{errors.supervisor.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Shift</label>
              <select
                {...register('shift')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select shift</option>
                {shifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
                  </option>
                ))}
              </select>
              {errors.shift && (
                <p className="mt-1 text-sm text-red-600">{errors.shift.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                {...register('role')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select role</option>
                <option value="Worker">Worker</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
              <input
                type="number"
                step="0.01"
                {...register('hourlyRate', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.hourlyRate && (
                <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
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
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                {...register('bankDetails.accountName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.bankDetails?.accountName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankDetails.accountName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                {...register('bankDetails.accountNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.bankDetails?.accountNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.bankDetails.accountNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                {...register('bankDetails.bankName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.bankDetails?.bankName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankDetails.bankName.message}</p>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingWorker ? 'Update' : 'Add'} Worker
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

      {/* Send Notification Modal */}
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => {
          setIsNotificationModalOpen(false);
          notificationForm.reset();
        }}
        title="Send Notification"
      >
        <form onSubmit={notificationForm.handleSubmit(handleSendNotification)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...notificationForm.register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {notificationForm.formState.errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {notificationForm.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              {...notificationForm.register('message')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {notificationForm.formState.errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {notificationForm.formState.errors.message.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              {...notificationForm.register('priority')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {notificationForm.formState.errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {notificationForm.formState.errors.priority.message}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              Sending notification to {selectedWorkers.length} selected worker(s)
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Send Notification
            </button>
            <button
              type="button"
              onClick={() => {
                setIsNotificationModalOpen(false);
                notificationForm.reset();
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