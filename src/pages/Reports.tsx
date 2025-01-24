import React, { useState } from 'react';
import { FileText, Download, Filter, Calendar, ArrowDownToDot } from 'lucide-react';
import { workers, factories, invoices, alerts, performance } from '../lib/data';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

type ReportType = 'labor' | 'performance' | 'payment' | 'attendance';
type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ReportConfig {
  type: ReportType;
  timeRange: TimeRange;
  factory?: string;
  format?: 'pdf' | 'csv' | 'excel';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  schedule?: 'daily' | 'weekly' | 'monthly';
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportConfig>({
    type: 'labor',
    timeRange: 'monthly'
  });
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const reports = [
    {
      id: 'labor',
      name: 'Labor Report',
      description: 'Worker distribution and cost analysis',
      lastGenerated: '2024-03-20',
      schedule: 'monthly',
    },
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'Productivity and efficiency metrics',
      lastGenerated: '2024-03-19',
      schedule: 'weekly',
    },
    {
      id: 'payment',
      name: 'Payment Report',
      description: 'Invoice and payment history analysis',
      lastGenerated: '2024-03-18',
      schedule: 'monthly',
    },
    {
      id: 'attendance',
      name: 'Attendance Report',
      description: 'Worker attendance and time tracking',
      lastGenerated: '2024-03-17',
      schedule: 'daily',
    },
  ];

  const generateReport = async () => {
    // In a real app, this would make an API call to generate the report
    console.log('Generating report with config:', selectedReport);
    
    // Simulate report generation
    const reportData = {
      labor: {
        totalWorkers: workers.length,
        activeWorkers: workers.filter(w => w.status === 'active').length,
        totalCost: workers.reduce((sum, w) => sum + w.hourlyRate * 8 * 20, 0), // Assuming 8 hours/day, 20 days/month
      },
      performance: {
        averageRating: performance.reduce((sum, p) => sum + p.rating, 0) / performance.length,
        topPerformers: performance.filter(p => p.rating >= 4.5).length,
      },
      payment: {
        totalInvoiced: invoices.reduce((sum, i) => sum + i.amount, 0),
        pendingPayments: invoices.filter(i => i.status === 'pending').length,
      },
      attendance: {
        presentToday: Math.floor(workers.length * 0.9),
        absentToday: Math.floor(workers.length * 0.1),
      },
    };

    // Create CSV content based on report type
    let csvContent = '';
    switch (selectedReport.type) {
      case 'labor':
        csvContent = `Total Workers,${reportData.labor.totalWorkers}\nActive Workers,${reportData.labor.activeWorkers}\nTotal Monthly Cost,${reportData.labor.totalCost}`;
        break;
      case 'performance':
        csvContent = `Average Rating,${reportData.performance.averageRating}\nTop Performers,${reportData.performance.topPerformers}`;
        break;
      // Add other cases as needed
    }

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.type}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsGenerateModalOpen(false);
  };

  const handleScheduleReport = (report: ReportTemplate) => {
    setSelectedTemplate(report);
    setIsScheduleModalOpen(true);
  };

  const handleDownloadReport = (report: ReportTemplate) => {
    // Simulate downloading the last generated report
    const csvContent = `Report Name,${report.name}\nGenerated Date,${report.lastGenerated}\nDescription,${report.description}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}-report-${report.lastGenerated}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FileText size={20} />
          Generate Report
        </button>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport.type}
              onChange={(e) => setSelectedReport({ ...selectedReport, type: e.target.value as ReportType })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="labor">Labor Report</option>
              <option value="performance">Performance Report</option>
              <option value="payment">Payment Report</option>
              <option value="attendance">Attendance Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={selectedReport.timeRange}
              onChange={(e) => setSelectedReport({ ...selectedReport, timeRange: e.target.value as TimeRange })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Factory (Optional)</label>
            <select
              value={selectedReport.factory}
              onChange={(e) => setSelectedReport({ ...selectedReport, factory: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Factories</option>
              {factories.map(factory => (
                <option key={factory.id} value={factory.name}>{factory.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FileText className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Total Reports</h3>
          <p className="text-2xl font-semibold mt-2">{reports.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Calendar className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Scheduled Reports</h3>
          <p className="text-2xl font-semibold mt-2">
            {reports.filter(r => r.schedule).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ArrowDownToDot className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Generated Today</h3>
          <p className="text-2xl font-semibold mt-2">
            {reports.filter(r => r.lastGenerated === new Date().toISOString().slice(0, 10)).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Download className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Downloads Today</h3>
          <p className="text-2xl font-semibold mt-2">12</p>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Available Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                </p>
                {report.schedule && (
                  <p className="text-xs text-blue-600 mt-1">
                    Scheduled: {report.schedule}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleScheduleReport(report)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Calendar size={20} />
                </button>
                <button 
                  onClick={() => handleDownloadReport(report)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Report"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Format</label>
            <select
              value={selectedReport.format}
              onChange={(e) => setSelectedReport({ ...selectedReport, format: e.target.value as 'pdf' | 'csv' | 'excel' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Report Details</h4>
            <p className="text-sm text-gray-600">Type: {selectedReport.type}</p>
            <p className="text-sm text-gray-600">Time Range: {selectedReport.timeRange}</p>
            <p className="text-sm text-gray-600">Factory: {selectedReport.factory || 'All Factories'}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={generateReport}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Schedule Report Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedTemplate(null);
        }}
        title="Schedule Report"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium mb-2">{selectedTemplate.name}</h4>
              <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Schedule Frequency</label>
              <select
                defaultValue={selectedTemplate.schedule}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Method</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="download">Download</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  console.log('Scheduling report:', selectedTemplate);
                  setIsScheduleModalOpen(false);
                  setSelectedTemplate(null);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Schedule
              </button>
              <button
                onClick={() => {
                  setIsScheduleModalOpen(false);
                  setSelectedTemplate(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}