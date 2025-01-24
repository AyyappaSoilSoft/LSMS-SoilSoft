import React, { useState } from 'react';
import { DollarSign, Download, Filter, TrendingUp, Calendar, FileText } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

interface Payslip {
  id: string;
  month: string;
  paymentDate: string;
  basicSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending';
}

export default function SalaryHistory() {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Mock payslip data
  const payslips: Payslip[] = [
    {
      id: '1',
      month: '2024-03',
      paymentDate: '2024-03-25',
      basicSalary: 2640,
      overtime: 450,
      bonuses: 200,
      deductions: 200,
      netSalary: 3090,
      status: 'paid'
    },
    {
      id: '2',
      month: '2024-02',
      paymentDate: '2024-02-25',
      basicSalary: 2640,
      overtime: 300,
      bonuses: 0,
      deductions: 200,
      netSalary: 2740,
      status: 'paid'
    },
    {
      id: '3',
      month: '2024-01',
      paymentDate: '2024-01-25',
      basicSalary: 2640,
      overtime: 375,
      bonuses: 500,
      deductions: 200,
      netSalary: 3315,
      status: 'paid'
    }
  ];

  const filteredPayslips = payslips.filter(payslip => {
    if (selectedYear && !payslip.month.startsWith(selectedYear)) return false;
    if (selectedMonth && !payslip.month.endsWith(`-${selectedMonth}`)) return false;
    return true;
  });

  const calculateYearlyTotal = () => {
    return filteredPayslips.reduce((sum, payslip) => sum + payslip.netSalary, 0);
  };

  const calculateAverageSalary = () => {
    if (filteredPayslips.length === 0) return 0;
    return calculateYearlyTotal() / filteredPayslips.length;
  };

  const handleDownloadPayslip = (payslip: Payslip) => {
    // Create a simple text representation of the payslip
    const payslipContent = `
PAYSLIP
=======
Month: ${new Date(payslip.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
Payment Date: ${new Date(payslip.paymentDate).toLocaleDateString()}

EARNINGS
--------
Basic Salary: $${payslip.basicSalary.toLocaleString()}
Overtime: $${payslip.overtime.toLocaleString()}
Bonuses: $${payslip.bonuses.toLocaleString()}

DEDUCTIONS
----------
Total Deductions: $${payslip.deductions.toLocaleString()}

NET SALARY: $${payslip.netSalary.toLocaleString()}
    `.trim();

    // Create and download the file
    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${payslip.month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBulkDownload = () => {
    filteredPayslips.forEach(payslip => {
      handleDownloadPayslip(payslip);
    });
  };

  const columns = [
    { 
      key: 'month', 
      label: 'Month',
      render: (value: string) => new Date(value).toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
      })
    },
    { 
      key: 'paymentDate', 
      label: 'Payment Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'basicSalary', 
      label: 'Basic Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'netSalary', 
      label: 'Net Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, payslip: Payslip) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedPayslip(payslip);
              setIsDetailsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            View Details
          </button>
          <button
            onClick={() => handleDownloadPayslip(payslip)}
            className="text-green-600 hover:text-green-800 flex items-center space-x-1"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Salary History</h1>
        <button
          onClick={handleBulkDownload}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download size={20} />
          <span>Download All Payslips</span>
        </button>
      </div>

      {/* Salary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DollarSign className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Year Total</h3>
          <p className="text-2xl font-semibold mt-1">
            ${calculateYearlyTotal().toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">For {selectedYear || 'all time'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TrendingUp className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Average Monthly</h3>
          <p className="text-2xl font-semibold mt-1">
            ${calculateAverageSalary().toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Based on current filters</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Calendar className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Latest Payment</h3>
          <p className="text-2xl font-semibold mt-1">
            ${payslips[0]?.netSalary.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(payslips[0]?.paymentDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FileText className="w-8 h-8 mb-2 text-yellow-600" />
          <h3 className="text-gray-500 text-sm font-medium">Available Payslips</h3>
          <p className="text-2xl font-semibold mt-1">{payslips.length}</p>
          <button
            onClick={handleBulkDownload}
            className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center space-x-1"
          >
            <Download size={14} />
            <span>Download All</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={month} value={month}>
                      {new Date(`2024-${month}-01`).toLocaleString('default', { month: 'long' })}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => handleDownloadPayslip(filteredPayslips[0])}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Download size={20} />
              <span>Download Latest Payslip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Salary History Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Payslip History</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleBulkDownload}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Download size={20} />
              <span>Download Selected</span>
            </button>
          </div>
        </div>
        <DataTable columns={columns} data={filteredPayslips} />
      </div>

      {/* Payslip Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPayslip(null);
        }}
        title="Payslip Details"
      >
        {selectedPayslip && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-lg mb-2">
                {new Date(selectedPayslip.month).toLocaleString('default', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              <p className="text-sm text-gray-600">
                Payment Date: {new Date(selectedPayslip.paymentDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Earnings</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium">${selectedPayslip.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime</span>
                  <span className="font-medium">${selectedPayslip.overtime.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonuses</span>
                  <span className="font-medium">${selectedPayslip.bonuses.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Deductions</h4>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deductions</span>
                <span className="font-medium text-red-600">
                  -${selectedPayslip.deductions.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Net Salary</span>
                <span>${selectedPayslip.netSalary.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleDownloadPayslip(selectedPayslip)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Download size={20} />
                <span>Download Payslip</span>
              </button>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedPayslip(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}