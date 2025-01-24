import React, { useState } from 'react';
import { TrendingUp, Award, Target, Star, BarChart, Search } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { workers } from '../../lib/data';

interface PerformanceRecord {
  id: string;
  name: string;
  department: string;
  rating: number;
  efficiency: number;
  qualityScore: number;
  supervisor: string;
  lastReview: string;
}

interface DepartmentMetric {
  name: string;
  efficiency: number;
  quality: number;
  target: number;
}

export default function FactoryPerformance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock performance data
  const [performanceRecords] = useState<PerformanceRecord[]>(
    workers.map(worker => ({
      id: worker.id,
      name: worker.name,
      department: ['Production', 'Assembly', 'Quality Control'][Math.floor(Math.random() * 3)],
      rating: 3 + Math.random() * 2,
      efficiency: 75 + Math.random() * 25,
      qualityScore: 80 + Math.random() * 20,
      supervisor: worker.supervisor || 'Unassigned',
      lastReview: '2024-03-20',
    }))
  );

  const departments = ['Production', 'Assembly', 'Quality Control'];

  const departmentMetrics: DepartmentMetric[] = departments.map(dept => ({
    name: dept,
    efficiency: Math.round(
      performanceRecords
        .filter(r => r.department === dept)
        .reduce((sum, r) => sum + r.efficiency, 0) /
      performanceRecords.filter(r => r.department === dept).length
    ),
    quality: Math.round(
      performanceRecords
        .filter(r => r.department === dept)
        .reduce((sum, r) => sum + r.qualityScore, 0) /
      performanceRecords.filter(r => r.department === dept).length
    ),
    target: 90,
  }));

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
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
    { 
      key: 'efficiency', 
      label: 'Efficiency',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <span>{value.toFixed(1)}%</span>
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${value >= 90 ? 'bg-green-600' : 'bg-yellow-600'}`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      )
    },
    { 
      key: 'qualityScore', 
      label: 'Quality Score',
      render: (value: number) => `${value.toFixed(1)}%`
    },
    { key: 'supervisor', label: 'Supervisor' },
    { 
      key: 'lastReview', 
      label: 'Last Review',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const filteredRecords = performanceRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === 'all' || record.department === selectedDepartment)
  );

  const calculateAverageRating = () => {
    return (filteredRecords.reduce((sum, r) => sum + r.rating, 0) / filteredRecords.length).toFixed(1);
  };

  const calculateTopPerformers = () => {
    return filteredRecords.filter(r => r.rating >= 4.5).length;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Factory Performance</h1>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TrendingUp className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
          <p className="text-2xl font-semibold mt-1">{calculateAverageRating()}/5.0</p>
          <p className="text-sm text-green-600 mt-1">↑ 0.2 from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Award className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Top Performers</h3>
          <p className="text-2xl font-semibold mt-1">{calculateTopPerformers()}</p>
          <p className="text-sm text-gray-500 mt-1">Above 4.5 rating</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Target className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Overall Efficiency</h3>
          <p className="text-2xl font-semibold mt-1">
            {Math.round(filteredRecords.reduce((sum, r) => sum + r.efficiency, 0) / filteredRecords.length)}%
          </p>
          <p className="text-sm text-yellow-600 mt-1">Target: 90%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <BarChart className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Quality Score</h3>
          <p className="text-2xl font-semibold mt-1">
            {Math.round(filteredRecords.reduce((sum, r) => sum + r.qualityScore, 0) / filteredRecords.length)}%
          </p>
          <p className="text-sm text-green-600 mt-1">Above target</p>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Department Performance</h2>
        <div className="space-y-4">
          {departmentMetrics.map((dept, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="w-1/4">
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-gray-500">Target: {dept.target}%</p>
              </div>
              <div className="w-3/4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Efficiency</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-grow bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${dept.efficiency >= dept.target ? 'bg-green-600' : 'bg-yellow-600'}`}
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{dept.efficiency}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Quality</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-grow bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${dept.quality >= dept.target ? 'bg-green-600' : 'bg-yellow-600'}`}
                        style={{ width: `${dept.quality}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{dept.quality}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Records */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Individual Performance</h2>
          <div className="flex items-center space-x-4">
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <DataTable columns={columns} data={filteredRecords} />
      </div>
    </div>
  );
}