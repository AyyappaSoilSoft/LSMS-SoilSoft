import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { alerts as initialAlerts } from '../lib/data';
import type { Alert } from '../lib/types';

export default function AlertManagement() {
  const [alertsList, setAlertsList] = useState<Alert[]>(initialAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleAcknowledgeSelected = async () => {
    if (selectedAlerts.length === 0) return;
    
    setIsProcessing(true);
    try {
      // In a real app, this would be an API call
      setAlertsList(prev => 
        prev.map(alert => 
          selectedAlerts.includes(alert.id)
            ? { ...alert, status: 'acknowledged' }
            : alert
        )
      );
      setSelectedAlerts([]);
    } catch (error) {
      console.error('Error acknowledging alerts:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolveSelected = async () => {
    if (selectedAlerts.length === 0) return;

    setIsProcessing(true);
    try {
      // In a real app, this would be an API call
      setAlertsList(prev => 
        prev.map(alert => 
          selectedAlerts.includes(alert.id)
            ? { ...alert, status: 'resolved' }
            : alert
        )
      );
      setSelectedAlerts([]);
    } catch (error) {
      console.error('Error resolving alerts:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (_: any, alert: Alert) => (
        <input
          type="checkbox"
          checked={selectedAlerts.includes(alert.id)}
          onChange={() => handleSelectAlert(alert.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={alert.status === 'resolved'}
        />
      )
    },
    { key: 'type', label: 'Type' },
    { key: 'message', label: 'Message' },
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
    { key: 'factory', label: 'Factory' },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value: string) => new Date(value).toLocaleString()
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

  const newAlertsCount = alertsList.filter(a => a.status === 'new').length;
  const acknowledgedAlertsCount = alertsList.filter(a => a.status === 'acknowledged').length;
  const resolvedAlertsCount = alertsList.filter(a => a.status === 'resolved').length;

  const selectedNewAlerts = selectedAlerts.filter(id => 
    alertsList.find(a => a.id === id)?.status === 'new'
  ).length;

  const selectedAcknowledgedAlerts = selectedAlerts.filter(id => 
    alertsList.find(a => a.id === id)?.status === 'acknowledged'
  ).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alert Management</h1>
        <div className="space-x-4">
          <button
            onClick={handleAcknowledgeSelected}
            disabled={isProcessing || selectedNewAlerts === 0}
            className={`px-4 py-2 rounded-lg ${
              isProcessing || selectedNewAlerts === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {isProcessing ? 'Processing...' : `Acknowledge Selected (${selectedNewAlerts})`}
          </button>
          <button
            onClick={handleResolveSelected}
            disabled={isProcessing || selectedAcknowledgedAlerts === 0}
            className={`px-4 py-2 rounded-lg ${
              isProcessing || selectedAcknowledgedAlerts === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? 'Processing...' : `Resolve Selected (${selectedAcknowledgedAlerts})`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">New Alerts</h3>
          <p className="text-2xl font-semibold mt-2">{newAlertsCount}</p>
          {newAlertsCount > 0 && (
            <p className="text-sm text-red-600 mt-1">Requires attention</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Acknowledged</h3>
          <p className="text-2xl font-semibold mt-2">{acknowledgedAlertsCount}</p>
          {acknowledgedAlertsCount > 0 && (
            <p className="text-sm text-yellow-600 mt-1">In progress</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Resolved Today</h3>
          <p className="text-2xl font-semibold mt-2">{resolvedAlertsCount}</p>
          {resolvedAlertsCount > 0 && (
            <p className="text-sm text-green-600 mt-1">Completed</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <DataTable columns={columns} data={alertsList} />
      </div>
    </div>
  );
}