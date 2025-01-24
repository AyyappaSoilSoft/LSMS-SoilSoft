import React from 'react';
import { TrendingUp, Award, Target, Star } from 'lucide-react';
import DataTable from '../../components/DataTable';

interface PerformanceRecord {
  id: string;
  date: string;
  rating: number;
  feedback: string;
  evaluator: string;
  category: string;
}

export default function WorkerPerformance() {
  // Mock performance data
  const performanceRecords: PerformanceRecord[] = [
    {
      id: '1',
      date: '2024-03-20',
      rating: 4.5,
      feedback: 'Excellent work quality and team collaboration',
      evaluator: 'Sarah Wilson',
      category: 'Monthly Review',
    },
    {
      id: '2',
      date: '2024-02-20',
      rating: 4.0,
      feedback: 'Good performance, meeting all targets',
      evaluator: 'Sarah Wilson',
      category: 'Monthly Review',
    },
  ];

  const columns = [
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
          <span className="mr-2">{value}</span>
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
    { key: 'evaluator', label: 'Evaluator' },
    { key: 'category', label: 'Category' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Performance Overview</h1>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TrendingUp className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Overall Rating</h3>
          <p className="text-2xl font-semibold mt-1">4.5/5.0</p>
          <p className="text-sm text-green-600 mt-1">↑ 0.3 from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Award className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Achievements</h3>
          <p className="text-2xl font-semibold mt-1">3</p>
          <p className="text-sm text-gray-500 mt-1">This quarter</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Target className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Goals Met</h3>
          <p className="text-2xl font-semibold mt-1">92%</p>
          <p className="text-sm text-green-600 mt-1">Above target</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Star className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Recognition</h3>
          <p className="text-2xl font-semibold mt-1">2</p>
          <p className="text-sm text-gray-500 mt-1">Recent awards</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          Performance Chart Placeholder
        </div>
      </div>

      {/* Recent Evaluations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Performance History</h2>
        <DataTable columns={columns} data={performanceRecords} />
      </div>
    </div>
  );
}