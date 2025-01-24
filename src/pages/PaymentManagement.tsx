import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { invoices as initialInvoices, factories } from '../lib/data';
import type { Invoice } from '../lib/types';

const invoiceSchema = z.object({
  factory: z.string().min(1, 'Factory is required'),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    rate: z.number().min(0, 'Rate must be positive'),
  })).min(1, 'At least one item is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

export default function PaymentManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0 }
  ]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [{ description: '', quantity: 1, rate: 0 }]
    }
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
      render: (value: string) => (
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
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const onSubmit = (data: InvoiceFormData) => {
    const total = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      factory: data.factory,
      amount: total,
      status: 'pending',
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
    };

    setInvoices([newInvoice, ...invoices]);
    setIsModalOpen(false);
    reset();
    setInvoiceItems([{ description: '', quantity: 1, rate: 0 }]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Outstanding</h3>
          <p className="text-2xl font-semibold mt-2">
            ${invoices
              .filter(i => i.status !== 'paid')
              .reduce((sum, inv) => sum + inv.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Overdue Invoices</h3>
          <p className="text-2xl font-semibold mt-2">
            {invoices.filter(i => i.status === 'overdue').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Paid This Month</h3>
          <p className="text-2xl font-semibold mt-2">
            ${invoices
              .filter(i => i.status === 'paid')
              .reduce((sum, inv) => sum + inv.amount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={invoices} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
          setInvoiceItems([{ description: '', quantity: 1, rate: 0 }]);
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
              {factories.map(factory => (
                <option key={factory.id} value={factory.name}>{factory.name}</option>
              ))}
            </select>
            {errors.factory && (
              <p className="mt-1 text-sm text-red-600">{errors.factory.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Invoice Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {invoiceItems.map((_, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      {...register(`items.${index}.description`)}
                      placeholder="Description"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Qty"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.rate`, { valueAsNumber: true })}
                      placeholder="Rate"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.items && (
              <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span>${calculateTotal().toLocaleString()}</span>
            </div>
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
                setInvoiceItems([{ description: '', quantity: 1, rate: 0 }]);
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