import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { workers as initialWorkers, wageUpdates } from '../lib/data';
import type { Worker } from '../lib/types';

const wageUpdateSchema = z.object({
  workerId: z.string().min(1, 'Worker is required'),
  newRate: z.number().min(0, 'New rate must be positive'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  reason: z.string().min(1, 'Reason is required'),
});

type WageUpdateFormData = z.infer<typeof wageUpdateSchema>;

export default function WageManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workers, setWorkers] = useState(initialWorkers);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<WageUpdateFormData>({
    resolver: zodResolver(wageUpdateSchema),
  });

  const selectedWorkerId = watch('workerId');
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

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
    { key: 'factory', label: 'Factory' },
    { 
      key: 'hourlyRate', 
      label: 'Hourly Rate',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    { key: 'role', label: 'Role' },
    { 
      key: 'startDate', 
      label: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const onSubmit = async (data: WageUpdateFormData) => {
    try {
      // In a real app, this would be an API call
      setWorkers(prev => 
        prev.map(worker => 
          worker.id === data.workerId
            ? { ...worker, hourlyRate: data.newRate }
            : worker
        )
      );
      
      setIsModalOpen(false);
      reset();
      setSelectedWorkers([]);
    } catch (error) {
      console.error('Error updating wage rate:', error);
    }
  };

  const calculateAverageRate = () => {
    return (workers.reduce((sum, w) => sum + w.hourlyRate, 0) / workers.length).toFixed(2);
  };

  const recentUpdates = wageUpdates.slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wage Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={selectedWorkers.length === 0}
          className={`px-4 py-2 rounded-lg ${
            selectedWorkers.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Update Rates ({selectedWorkers.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Average Hourly Rate</h3>
          <p className="text-2xl font-semibold mt-2">
            ${calculateAverageRate()}
          </p>
          <p className="text-sm text-gray-500">Across all workers</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Workers</h3>
          <p className="text-2xl font-semibold mt-2">{workers.length}</p>
          <p className="text-sm text-gray-500">Active employees</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Recent Updates</h3>
          <p className="text-2xl font-semibold mt-2">{recentUpdates.length}</p>
          <p className="text-sm text-gray-500">In the last 30 days</p>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Recent Rate Updates</h2>
        <div className="space-y-4">
          {recentUpdates.map(update => {
            const worker = workers.find(w => w.id === update.workerId);
            return (
              <div key={update.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{worker?.name}</p>
                  <p className="text-sm text-gray-500">
                    Rate changed from ${update.oldRate.toFixed(2)} to ${update.newRate.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Effective: {new Date(update.effectiveDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Approved by: {update.approvedBy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable columns={columns} data={workers} />
      </div>

      {/* Update Rate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Update Wage Rate"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Worker</label>
            <select
              {...register('workerId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select worker</option>
              {selectedWorkers.map(id => {
                const worker = workers.find(w => w.id === id);
                return worker ? (
                  <option key={worker.id} value={worker.id}>
                    {worker.name} (Current: ${worker.hourlyRate.toFixed(2)})
                  </option>
                ) : null;
              })}
            </select>
            {errors.workerId && (
              <p className="mt-1 text-sm text-red-600">{errors.workerId.message}</p>
            )}
          </div>

          {selectedWorker && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Current Rate: ${selectedWorker.hourlyRate.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Role: {selectedWorker.role}</p>
              <p className="text-sm text-gray-600">Factory: {selectedWorker.factory}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">New Hourly Rate</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('newRate', { valueAsNumber: true })}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {errors.newRate && (
              <p className="mt-1 text-sm text-red-600">{errors.newRate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Effective Date</label>
            <input
              type="date"
              {...register('effectiveDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.effectiveDate && (
              <p className="mt-1 text-sm text-red-600">{errors.effectiveDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason for Update</label>
            <textarea
              {...register('reason')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Annual review, Performance increase, etc."
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
              Update Rate
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