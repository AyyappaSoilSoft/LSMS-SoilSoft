import React from 'react';
import { Users, Factory, AlertTriangle, DollarSign, TrendingUp, FileText, Clock, UserCheck, UserX, Calendar } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { workers, factories, alerts } from '../../lib/data';

export default function AdminDashboard() {
  const recentAlerts = alerts.slice(0, 5);
  
  // Calculate attendance statistics
  const totalWorkers = workers.length;
  const presentWorkers = Math.floor(workers.length * 0.85); // 85% present
  const onLeave = Math.floor(workers.length * 0.15); // 15% on leave
  
  const presentPercentage = (presentWorkers / totalWorkers) * 100;
  const leavePercentage = (onLeave / totalWorkers) * 100;

  const alertColumns = [
    { key: 'type', label: 'Type' },
    { key: 'factory', label: 'Factory' },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'low' ? 'bg-blue-100 text-blue-800' :
          value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
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
          value === 'new' ? 'bg-red-100 text-red-800' :
          value === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of all operations and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
          <Users className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Workers</h3>
          <p className="text-2xl font-semibold mt-1">{workers.length}</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
          <Factory className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Active Factories</h3>
          <p className="text-2xl font-semibold mt-1">
            {factories.filter(f => f.status === 'active').length}
          </p>
          <p className="text-sm text-green-600 mt-2">↑ 2 new this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
          <AlertTriangle className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Active Alerts</h3>
          <p className="text-2xl font-semibold mt-1">
            {alerts.filter(a => a.status === 'new').length}
          </p>
          <p className="text-sm text-red-600 mt-2">↑ 5 new alerts</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
          <DollarSign className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Monthly Payroll</h3>
          <p className="text-2xl font-semibold mt-1">$234,500</p>
          <p className="text-sm text-green-600 mt-2">On track</p>
        </div>

        {/* New Present Workers Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
          <UserCheck className="w-8 h-8 mb-2 text-emerald-600" />
          <h3 className="text-gray-500 text-sm font-medium">Present Today</h3>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-semibold">{presentPercentage.toFixed(1)}%</p>
            <span className="text-sm text-gray-500 ml-2">({presentWorkers})</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full" 
              style={{ width: `${presentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* New On Leave Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm col-span-1">
          <Calendar className="w-8 h-8 mb-2 text-orange-600" />
          <h3 className="text-gray-500 text-sm font-medium">On Leave</h3>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-semibold">{leavePercentage.toFixed(1)}%</p>
            <span className="text-sm text-gray-500 ml-2">({onLeave})</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full" 
              style={{ width: `${leavePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Factory Performance</h2>
            <TrendingUp className="text-green-600" />
          </div>
          <div className="space-y-4">
            {factories.map(factory => (
              <div key={factory.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{factory.name}</p>
                  <p className="text-sm text-gray-500">{factory.workers} workers</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">92%</p>
                    <p className="text-sm text-gray-500">Efficiency</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Today's Overview</h2>
            <Clock className="text-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-green-600">{presentPercentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Present ({presentWorkers} workers)</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${presentPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-orange-600">{leavePercentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">On Leave ({onLeave} workers)</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${leavePercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Alerts</h2>
          <button 
            onClick={() => window.location.href = '/alerts'}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <DataTable columns={alertColumns} data={recentAlerts} />
      </div>
    </div>
  );
}