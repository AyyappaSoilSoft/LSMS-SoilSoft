import React from 'react';
import { workers, factories, invoices, alerts } from '../lib/data';

export default function Dashboard() {
  const stats = [
    { 
      label: 'Total Workers', 
      value: workers.length.toString(), 
      change: '+12%' 
    },
    { 
      label: 'Active Factories', 
      value: factories.filter(f => f.status === 'active').length.toString(), 
      change: '+2' 
    },
    { 
      label: 'Pending Invoices', 
      value: `$${invoices.filter(i => i.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`,
      change: '-8%' 
    },
    { 
      label: 'Active Alerts', 
      value: alerts.filter(a => a.status === 'new').length.toString(), 
      change: '+5' 
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <span className={`text-sm ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labor Attendance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Labor Attendance</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            Chart Placeholder
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            Metrics Placeholder
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{alert.type}</p>
                  <p className="text-sm text-gray-500">{alert.factory}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Outstanding Invoices</p>
                <p className="text-sm text-gray-500">
                  {invoices.filter(i => i.status === 'pending').length} invoices pending
                </p>
              </div>
              <span className="text-lg font-semibold">
                ${invoices
                  .filter(i => i.status === 'pending')
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Paid This Month</p>
                <p className="text-sm text-gray-500">
                  {invoices.filter(i => i.status === 'paid').length} invoices processed
                </p>
              </div>
              <span className="text-lg font-semibold">
                ${invoices
                  .filter(i => i.status === 'paid')
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}