import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, Award, Target, Star } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { workers } from '../../lib/data';

const performanceSchema = z.object({
  workerId: z.string().min(1, 'Worker is required'),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, 'Please provide detailed feedback'),
  category: z.enum(['monthly', 'quarterly', 'annual', 'project']),
});

type PerformanceFormData = z.infer<typeof performanceSchema>;

interface PerformanceRecord {
  id: string;
  workerName: string;
  date: string;
  rating: number;
  feedback: string;
  category: string;
}

export default function SupervisorPerformance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(
    workers.map(worker => ({
      id: worker.id,
      workerName: worker.name,
      date: '2024-03-20',
      rating: 4 + Math.random(),
      feedback: 'Consistently meets expectations and demonstrates good work ethic',
      category: 'Monthly Review',
    }))
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
  });

  const columns = [
    { key: 'workerName', label: 'Worker' },
    { 
      key: 'date', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (value: number) => (
        <div className="flex items-center">
          <span className="mr-2">{value.toFixed(1)}</span>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={index < Math.floor(value) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
      )
    },
    { key: 'feedback', label: 'Feedback' },
    { key: 'category', label: 'Category' },
  ];

  const onSubmit = (data: PerformanceFormData) => {
    const worker = workers.find(w => w.id === data.workerId);
    if (!worker) return;

    const newRecord: PerformanceRecord = {
      id: `${Date.now()}`,
      workerName: worker.name,
      date: new Date().toISOString().slice(0, 10),
      rating: data.rating,
      feedback: data.feedback,
      category: data.category === 'monthly' ? 'Monthly Review' :
               data.category === 'quarterly' ? 'Quarterly Review' :
               data.category === 'annual' ? 'Annual Review' : 'Project Review',
    };

    setPerformanceRecords(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
    reset();
  };

  const calculateTeamAverage = () => {
    const total = performanceRecords.reduce((sum, record) => sum + record.rating, 0);
    return (total / performanceRecords.length).toFixed(1);
  };

  const getTopPerformersCount = () => {
    return performanceRecords.filter(record => record.rating >= 4.5).length;
  };

  const getImprovementNeededCount = () => {
    return performanceRecords.filter(record => record.rating < 3.0).length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Performance</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Review
        </button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TrendingUp className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Team Average</h3>
          <p className="text-2xl font-semibold mt-1">{calculateTeamAverage()}/5.0</p>
          <p className="text-sm text-green-600 mt-1">↑ 0.3 from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Award className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Top Performers</h3>
          <p className="text-2xl font-semibold mt-1">{getTopPerformersCount()}</p>
          <p className="text-sm text-gray-500 mt-1">Above 4.5 rating</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Target className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Reviews Done</h3>
          <p className="text-2xl font-semibold mt-1">{performanceRecords.length}/{workers.length}</p>
          <p className="text-sm text-yellow-600 mt-1">{workers.length - performanceRecords.length} pending</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Star className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Improvement Needed</h3>
          <p className="text-2xl font-semibold mt-1">{getImprovementNeededCount()}</p>
          <p className="text-sm text-red-600 mt-1">Below 3.0 rating</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
        <DataTable columns={columns} data={performanceRecords} />
      </div>

      {/* Add Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Add Performance Review"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Worker</label>
            <select
              {...register('workerId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select worker</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </select>
            {errors.workerId && (
              <p className="mt-1 text-sm text-red-600">{errors.workerId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              {...register('rating', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register('category')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="monthly">Monthly Review</option>
              <option value="quarterly">Quarterly Review</option>
              <option value="annual">Annual Review</option>
              <option value="project">Project Review</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              {...register('feedback')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.feedback && (
              <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>
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