import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Download, Filter, DollarSign } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { invoices } from '../../lib/data';
import type { Invoice } from '../../lib/types';

const invoiceSchema = z.object({
  factory: z.string().min(1, 'Factory is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function Invoices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const columns = [
    { key: 'factory', label: 'Factory' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => value && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'paid' ? 'bg-green-100 text-green-800' : 
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'dueDate', 
      label: 'Due Date',
      render: (value: string) => value && new Date(value).toLocaleDateString()
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value: string) => value && new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, invoice: Invoice) => invoice && (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleDownload(invoice)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Download size={16} />
          </button>
          {invoice.status === 'pending' && (
            <button
              onClick={() => handleMarkAsPaid(invoice)}
              className="text-green-600 hover:text-green-800"
            >
              <DollarSign size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleDownload = (invoice: Invoice) => {
    // In a real application, this would generate and download a PDF invoice
    console.log('Downloading invoice:', invoice);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    // In a real application, this would update the invoice status in the database
    console.log('Marking invoice as paid:', invoice);
  };

  const onSubmit = (data: InvoiceFormData) => {
    console.log('Creating invoice:', data);
    setIsModalOpen(false);
    reset();
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (selectedStatus !== 'all' && invoice.status !== selectedStatus) return false;
    
    if (dateRange.start && new Date(invoice.createdAt) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(invoice.createdAt) > new Date(dateRange.end)) return false;
    
    return true;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = filteredInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Invoice
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Amount</h3>
          <p className="text-2xl font-semibold mt-2">${totalAmount.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Pending Amount</h3>
          <p className="text-2xl font-semibold mt-2">${pendingAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Overdue Amount</h3>
          <p className="text-2xl font-semibold mt-2">${overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
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

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DataTable columns={columns} data={filteredInvoices} />
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Create Invoice"
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
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Invoice
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