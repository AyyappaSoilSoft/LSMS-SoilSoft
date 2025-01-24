import React, { useState } from 'react';
import { DollarSign, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { factories, invoices as initialInvoices } from '../../lib/data';
import type { Invoice } from '../../lib/types';

const generateInvoiceSchema = z.object({
  factory: z.string().min(1, 'Factory is required'),
  period: z.string().min(1, 'Period is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    rate: z.number().min(0, 'Rate must be positive'),
  })).min(1, 'At least one item is required'),
});

type GenerateInvoiceFormData = z.infer<typeof generateInvoiceSchema>;

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

export default function AccountsDashboard() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0 }
  ]);

  const paymentSchema = z.object({
    paymentDate: z.string().min(1, 'Payment date is required'),
    paymentMethod: z.enum(['bank_transfer', 'check', 'cash']),
    reference: z.string().min(1, 'Reference number is required'),
    notes: z.string().optional(),
  });

  type PaymentFormData = z.infer<typeof paymentSchema>;

  const { register: registerPayment, handleSubmit: handleSubmitPayment, reset: resetPayment, formState: { errors: paymentErrors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GenerateInvoiceFormData>({
    resolver: zodResolver(generateInvoiceSchema),
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
      key: 'actions',
      label: 'Actions',
      render: (_: any, invoice: Invoice) => (
        <button
          onClick={() => handleDownloadInvoice(invoice)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Download size={16} />
        </button>
      )
    }
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

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Downloading invoice:', invoice);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const onSubmitPayment = (data: PaymentFormData) => {
    if (!selectedInvoice) return;

    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === selectedInvoice.id 
          ? { 
              ...inv, 
              status: 'paid',
              paymentDate: data.paymentDate,
              paymentMethod: data.paymentMethod,
              reference: data.reference,
              notes: data.notes
            } 
          : inv
      )
    );

    setIsPaymentModalOpen(false);
    setSelectedInvoice(null);
    resetPayment();
  };

  const onSubmit = (data: GenerateInvoiceFormData) => {
    console.log('Generating invoice:', data);
    setIsGenerateModalOpen(false);
    reset();
    setInvoiceItems([{ description: '', quantity: 1, rate: 0 }]);
  };

  const recentInvoices = invoices.slice(0, 5);
  const totalOutstanding = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const paidThisMonth = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accounts Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DollarSign className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Outstanding</h3>
          <p className="text-2xl font-semibold mt-1">${totalOutstanding.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FileText className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Pending Invoices</h3>
          <p className="text-2xl font-semibold mt-1">{invoices.filter(i => i.status === 'pending').length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Paid This Month</h3>
          <p className="text-2xl font-semibold mt-1">${paidThisMonth.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <AlertTriangle className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Overdue</h3>
          <p className="text-2xl font-semibold mt-1">{overdueCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Generate Invoice</h2>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate New Invoice
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Payment Updates</h2>
          <div className="space-y-4">
            {invoices
              .filter(inv => inv.status === 'pending')
              .slice(0, 3)
              .map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium">{invoice.factory}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                    <button 
                      onClick={() => handleMarkAsPaid(invoice)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark as Paid
                    </button>
                  </div>
                </div>
              ))}
            {invoices.filter(inv => inv.status === 'pending').length === 0 && (
              <p className="text-center text-gray-500 py-4">No pending payments</p>
            )}
            {invoices.filter(inv => inv.status === 'pending').length > 3 && (
              <button
                onClick={() => window.location.href = '/invoices'}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View All Pending Payments
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <button 
            onClick={() => window.location.href = '/invoices'}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <DataTable columns={columns} data={recentInvoices} />
      </div>

      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false);
          reset();
          setInvoiceItems([{ description: '', quantity: 1, rate: 0 }]);
        }}
        title="Generate Invoice"
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
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <input
              type="month"
              {...register('period')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.period && (
              <p className="mt-1 text-sm text-red-600">{errors.period.message}</p>
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
              Generate Invoice
            </button>
            <button
              type="button"
              onClick={() => {
                setIsGenerateModalOpen(false);
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

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedInvoice(null);
          resetPayment();
        }}
        title="Record Payment"
      >
        {selectedInvoice && (
          <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Invoice Amount:</span>
                <span className="font-semibold">${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Factory:</span>
                <span className="font-semibold">{selectedInvoice.factory}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Date</label>
              <input
                type="date"
                {...registerPayment('paymentDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {paymentErrors.paymentDate && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.paymentDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                {...registerPayment('paymentMethod')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
              </select>
              {paymentErrors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.paymentMethod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reference Number</label>
              <input
                type="text"
                {...registerPayment('reference')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Transaction ID or Check Number"
              />
              {paymentErrors.reference && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.reference.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                {...registerPayment('notes')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Any additional payment details..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Confirm Payment
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setSelectedInvoice(null);
                  resetPayment();
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