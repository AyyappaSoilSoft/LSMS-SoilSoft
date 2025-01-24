import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { factories, users } from '../lib/data';
import type { Factory } from '../lib/types';

// Update the factory form schema
const factorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  supervisor: z.string().min(1, 'Supervisor is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  operatingHours: z.object({
    start: z.string().min(1, 'Start time is required'),
    end: z.string().min(1, 'End time is required'),
  }),
  departments: z.array(z.string()).min(1, 'At least one department is required'),
  contactDetails: z.object({
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email'),
    address: z.string().min(1, 'Address is required'),
  }),
});

type FactoryFormData = z.infer<typeof factorySchema>;

export default function FactoryManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FactoryFormData>({
    resolver: zodResolver(factorySchema),
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'workers', label: 'Workers' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const handleEdit = (factory: Factory) => {
    setEditingFactory(factory);
    reset({
      ...factory,
      operatingHours: factory.operatingHours || { start: '', end: '' },
      departments: factory.departments || [],
      contactDetails: factory.contactDetails || {
        phone: '',
        email: '',
        address: '',
      },
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (factory: Factory) => {
    if (window.confirm(`Are you sure you want to delete ${factory.name}?`)) {
      // In a real app, make API call to delete factory
      console.log('Deleting factory:', factory);
    }
  };

  const onSubmit = async (data: FactoryFormData) => {
    if (editingFactory) {
      // In a real app, make API call to update factory
      console.log('Updating factory:', data);
    } else {
      // In a real app, make API call to create factory
      console.log('Creating factory:', data);
    }
    setIsModalOpen(false);
    reset();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factory Management</h1>
        <button
          onClick={() => {
            setEditingFactory(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Factory
        </button>
      </div>

      <DataTable
        columns={columns}
        data={factories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title={editingFactory ? 'Edit Factory' : 'Add Factory'}
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
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                {...register('location')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Supervisor</label>
              <select
                {...register('supervisor')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a supervisor</option>
                {users
                  .filter((user) => user.role === 'supervisor')
                  .map((supervisor) => (
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
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Operating Hours</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  {...register('operatingHours.start')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.operatingHours?.start && (
                  <p className="mt-1 text-sm text-red-600">{errors.operatingHours.start.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  {...register('operatingHours.end')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.operatingHours?.end && (
                  <p className="mt-1 text-sm text-red-600">{errors.operatingHours.end.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Departments</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Departments</label>
              <select
                multiple
                {...register('departments')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Production">Production</option>
                <option value="Assembly">Assembly</option>
                <option value="Quality Control">Quality Control</option>
              </select>
              {errors.departments && (
                <p className="mt-1 text-sm text-red-600">{errors.departments.message}</p>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                {...register('contactDetails.phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.contactDetails?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactDetails.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('contactDetails.email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.contactDetails?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.contactDetails.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                {...register('contactDetails.address')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.contactDetails?.address && (
                <p className="mt-1 text-sm text-red-600">{errors.contactDetails.address.message}</p>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingFactory ? 'Update' : 'Add'} Factory
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