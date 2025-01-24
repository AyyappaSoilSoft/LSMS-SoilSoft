import React, { useState } from 'react';
import { Users, Factory, AlertTriangle, DollarSign, TrendingUp, FileText, Clock, UserCheck, MessageSquare, Truck } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { workers, factories, alerts } from '../../lib/data';

// Form schemas
const remarkSchema = z.object({
  recipient: z.string().min(1, 'Recipient is required'),
  recipientType: z.enum(['worker', 'supervisor']),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  category: z.string().min(1, 'Category is required'),
  rating: z.number().min(1).max(5),
  status: z.enum(['active', 'inactive']),
});

type RemarkFormData = z.infer<typeof remarkSchema>;
type SupplierFormData = z.infer<typeof supplierSchema>;

interface Remark {
  id: string;
  recipient: string;
  recipientType: 'worker' | 'supervisor';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'sent' | 'read' | 'acknowledged';
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive';
  lastDelivery?: string;
  totalOrders: number;
}

export default function FactoryDashboard() {
  // State for modals
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Mock data
  const [remarks, setRemarks] = useState<Remark[]>([
    {
      id: '1',
      recipient: 'John Smith',
      recipientType: 'worker',
      subject: 'Performance Recognition',
      message: 'Great work on meeting production targets this week.',
      priority: 'medium',
      createdAt: '2024-03-20',
      status: 'sent'
    },
    {
      id: '2',
      recipient: 'Sarah Wilson',
      recipientType: 'supervisor',
      subject: 'Safety Protocol Update',
      message: 'Please review and implement new safety guidelines.',
      priority: 'high',
      createdAt: '2024-03-19',
      status: 'read'
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Quality Materials Co.',
      contactPerson: 'Jane Wilson',
      email: 'jane@qualitymaterials.com',
      phone: '555-0123',
      category: 'Raw Materials',
      rating: 4.5,
      status: 'active',
      lastDelivery: '2024-03-18',
      totalOrders: 156
    },
    {
      id: '2',
      name: 'Tech Equipment Ltd.',
      contactPerson: 'Mike Johnson',
      email: 'mike@techequipment.com',
      phone: '555-0124',
      category: 'Equipment',
      rating: 4.0,
      status: 'active',
      lastDelivery: '2024-03-15',
      totalOrders: 89
    }
  ]);

  // Form handlers
  const { register: remarkRegister, handleSubmit: handleRemarkSubmit, reset: resetRemark, formState: { errors: remarkErrors } } = useForm<RemarkFormData>({
    resolver: zodResolver(remarkSchema)
  });

  const { register: supplierRegister, handleSubmit: handleSupplierSubmit, reset: resetSupplier, formState: { errors: supplierErrors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema)
  });

  // Table columns
  const remarkColumns = [
    { key: 'recipient', label: 'Recipient' },
    { key: 'recipientType', label: 'Type' },
    { key: 'subject', label: 'Subject' },
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
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'sent' ? 'bg-blue-100 text-blue-800' :
          value === 'read' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const supplierColumns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'contactPerson', label: 'Contact Person' },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (value: number) => '⭐'.repeat(Math.round(value))
    },
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
      key: 'actions',
      label: 'Actions',
      render: (_: any, supplier: Supplier) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditSupplier(supplier)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteSupplier(supplier.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  // Handlers
  const handleRemarkSubmission = async (data: RemarkFormData) => {
    const newRemark: Remark = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };

    setRemarks([newRemark, ...remarks]);
    setIsRemarkModalOpen(false);
    resetRemark();
  };

  const handleSupplierSubmission = async (data: SupplierFormData) => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === editingSupplier.id
          ? { ...supplier, ...data }
          : supplier
      ));
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...data,
        totalOrders: 0
      };
      setSuppliers([newSupplier, ...suppliers]);
    }

    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
    resetSupplier();
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Factory Dashboard</h1>
        <p className="text-gray-600">Overview of operations and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Users className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Workers</h3>
          <p className="text-2xl font-semibold mt-1">{workers.length}</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Truck className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Active Suppliers</h3>
          <p className="text-2xl font-semibold mt-1">
            {suppliers.filter(s => s.status === 'active').length}
          </p>
          <p className="text-sm text-green-600 mt-2">All performing well</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <AlertTriangle className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
          <p className="text-2xl font-semibold mt-1">
            {alerts.filter(a => a.status === 'new').length}
          </p>
          <p className="text-sm text-red-600 mt-2">↑ 5 new alerts</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <MessageSquare className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Recent Remarks</h3>
          <p className="text-2xl font-semibold mt-1">{remarks.length}</p>
          <p className="text-sm text-blue-600 mt-2">View all</p>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Remarks</h2>
          <button
            onClick={() => setIsRemarkModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Remark
          </button>
        </div>
        <DataTable columns={remarkColumns} data={remarks} />
      </div>

      {/* Suppliers Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Suppliers</h2>
          <button
            onClick={() => {
              setEditingSupplier(null);
              setIsSupplierModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Supplier
          </button>
        </div>
        <DataTable columns={supplierColumns} data={suppliers} />
      </div>

      {/* Add/Edit Remark Modal */}
      <Modal
        isOpen={isRemarkModalOpen}
        onClose={() => {
          setIsRemarkModalOpen(false);
          resetRemark();
        }}
        title="Add Remark"
      >
        <form onSubmit={handleRemarkSubmit(handleRemarkSubmission)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient Type</label>
            <select
              {...remarkRegister('recipientType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="worker">Worker</option>
              <option value="supervisor">Supervisor</option>
            </select>
            {remarkErrors.recipientType && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.recipientType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient</label>
            <select
              {...remarkRegister('recipient')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select recipient</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.name}>{worker.name}</option>
              ))}
            </select>
            {remarkErrors.recipient && (
              <p className="mt-1 text-sm text-red-600">{remarkErrors.recipient.message}</p>
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

      {/* Add/Edit Supplier Modal */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setEditingSupplier(null);
          resetSupplier();
        }}
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
      >
        <form onSubmit={handleSupplierSubmit(handleSupplierSubmission)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...supplierRegister('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {supplierErrors.name && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Person</label>
            <input
              type="text"
              {...supplierRegister('contactPerson')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {supplierErrors.contactPerson && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.contactPerson.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...supplierRegister('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {supplierErrors.email && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              {...supplierRegister('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {supplierErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...supplierRegister('category')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Equipment">Equipment</option>
              <option value="Packaging">Packaging</option>
              <option value="Tools">Tools</option>
              <option value="Safety Equipment">Safety Equipment</option>
            </select>
            {supplierErrors.category && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              {...supplierRegister('rating', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {supplierErrors.rating && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.rating.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...supplierRegister('status')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {supplierErrors.status && (
              <p className="mt-1 text-sm text-red-600">{supplierErrors.status.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingSupplier ? 'Update' : 'Add'} Supplier
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSupplierModalOpen(false);
                setEditingSupplier(null);
                resetSupplier();
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