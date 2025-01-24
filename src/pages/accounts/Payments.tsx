import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const paymentSchema = z.object({
  factory: z.string().min(1, 'Factory is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  type: z.enum(['incoming', 'outgoing']),
  description: z.string().min(1, 'Description is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface Payment {
  id: string;
  factory: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  description: string;
  date: string;
}

export default function Payments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock payments data
  const [payments] = useState<Payment[]>([
    {
      id: '1',
      factory: 'Factory A',
      amount: 45000,
      type: 'incoming',
      description: 'Monthly payment for labor services',
      date: '2024-03-20',
    },
    {
      id: '2',
      factory: 'Factory B',
      amount: 12000,
      type: 'outgoing',
      description: 'Worker bonus payments',
      date: '2024-03-19',
    },
  ]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const columns = [
    { key: 'factory', label: 'Factory' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: number, payment: Payment) => (
        <div className={`flex items-center ${
          payment.type === 'incoming' ? 'text-green-600' : 'text-red-600'
        }`}>
          {payment.type === 'incoming' ? '+' : '-'}${value.toLocaleString()}
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: 'incoming' | 'outgoing') => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'incoming' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'description', label: 'Description' },
    { 
      key: 'date', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const onSubmit = (data: PaymentFormData) => {
    console.log('Recording payment:', data);
    setIsModalOpen(false);
    reset();
  };

  const filteredPayments = payments.filter(payment => {
    if (selectedType !== 'all' && payment.type !== selectedType) return false;
    
    if (dateRange.start && new Date(payment.date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(payment.date) > new Date(dateRange.end)) return false;
    
    return true;
  });

  const totalIncoming = filteredPayments
    .filter(p => p.type === 'incoming')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOutgoing = filteredPayments
    .filter(p => p.type === 'outgoing')
    .reduce((sum, p) => sum + p.amount, 0);

  const balance = totalIncoming - totalOutgoing;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Record Payment
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DollarSign className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Current Balance</h3>
          <p className={`text-2xl font-semibold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ArrowUpRight className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Incoming</h3>
          <p className="text-2xl font-semibold mt-1 text-green-600">
            ${totalIncoming.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ArrowDownRight className="w-8 h-8 mb-2 text-red-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Outgoing</h3>
          <p className="text-2xl font-semibold mt-1 text-red-600">
            ${totalOutgoing.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Calendar className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Transactions</h3>
          <p className="text-2xl font-semibold mt-1">
            {filteredPayments.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DataTable<Payment> columns={columns} data={filteredPayments} />
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Record Payment"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Factory</label>
            <select
              {...register('factory')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select factory</option>
              <option value="Factory A">Factory A</option>
              <option value="Factory B">Factory B</option>
            </select>
            {errors.factory && (
              <p className="mt-1 text-sm text-red-600">{errors.factory.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Record Payment
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