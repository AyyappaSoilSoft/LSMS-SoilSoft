import React, { useState } from 'react';
import { Clock, Calendar, FileText, MessageSquare, DollarSign, Clock3, Download } from 'lucide-react';
import Modal from '../../components/Modal';
import DataTable from '../../components/DataTable';

interface PaySlip {
  id: string;
  month: string;
  basicSalary: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending';
}

interface OvertimeRecord {
  date: string;
  hours: number;
  rate: number;
  status: 'approved' | 'pending' | 'rejected';
}

export default function WorkerDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Mock data
  const hourlyRate = 15;
  const workingHours = 8;
  const workingDays = 22;
  const overtimeRate = hourlyRate * 1.5;

  const basicMonthlyIncome = hourlyRate * workingHours * workingDays;
  
  const overtimeHours = 12; // Example: 12 hours overtime this month
  const overtimeEarnings = overtimeHours * overtimeRate;
  
  const totalEstimatedIncome = basicMonthlyIncome + overtimeEarnings;

  // Mock overtime records
  const overtimeRecords: OvertimeRecord[] = [
    {
      date: '2024-03-20',
      hours: 2.5,
      rate: overtimeRate,
      status: 'approved'
    },
    {
      date: '2024-03-19',
      hours: 1.5,
      rate: overtimeRate,
      status: 'pending'
    }
  ];

  // Mock payslip history
  const payslips: PaySlip[] = [
    {
      id: '1',
      month: '2024-03',
      basicSalary: basicMonthlyIncome,
      overtime: 450,
      deductions: 200,
      netSalary: basicMonthlyIncome + 450 - 200,
      status: 'paid'
    },
    {
      id: '2',
      month: '2024-02',
      basicSalary: basicMonthlyIncome,
      overtime: 300,
      deductions: 200,
      netSalary: basicMonthlyIncome + 300 - 200,
      status: 'paid'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const handleDownloadPayslip = (month: string) => {
    // In a real app, this would generate and download a PDF payslip
    console.log('Downloading payslip for:', month);
  };

  const payslipColumns = [
    { 
      key: 'month', 
      label: 'Month',
      render: (value: string) => new Date(value).toLocaleDateString('default', { 
        year: 'numeric', 
        month: 'long' 
      })
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
      render: (_: any, payslip: PaySlip) => (
        <button
          onClick={() => handleDownloadPayslip(payslip.month)}
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, John</h1>
        <p className="text-gray-600">
          {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
        </p>
      </div>

      {/* Income Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DollarSign className="w-8 h-8 mb-2 text-green-600" />
          <h3 className="text-gray-500 text-sm font-medium">Estimated Monthly Income</h3>
          <p className="text-2xl font-semibold mt-1">${totalEstimatedIncome.toLocaleString()}</p>
          <div className="mt-2 text-sm">
            <p className="text-gray-500">Base: ${basicMonthlyIncome.toLocaleString()}</p>
            <p className="text-green-600">Overtime: +${overtimeEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Clock3 className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="text-gray-500 text-sm font-medium">Overtime This Month</h3>
          <p className="text-2xl font-semibold mt-1">{overtimeHours} hours</p>
          <p className="text-sm text-gray-500 mt-1">Rate: ${overtimeRate}/hour</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <FileText className="w-8 h-8 mb-2 text-purple-600" />
          <h3 className="text-gray-500 text-sm font-medium">Latest Payslip</h3>
          <p className="text-2xl font-semibold mt-1">
            ${payslips[0]?.netSalary.toLocaleString()}
          </p>
          <button
            onClick={() => setIsPayslipModalOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-800 mt-1"
          >
            View History
          </button>
        </div>
      </div>

      {/* Check In/Out Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center">
          <Clock size={48} className="mx-auto mb-4 text-blue-600" />
          <button
            onClick={handleCheckInOut}
            className={`px-8 py-4 rounded-lg text-white text-lg font-semibold ${
              isCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
          {isCheckedIn && (
            <p className="mt-4 text-green-600">
              Checked in at: {new Date().toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Recent Overtime */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Recent Overtime</h2>
        <div className="space-y-4">
          {overtimeRecords.map((record, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{record.hours} hours</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(record.hours * record.rate).toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  record.status === 'approved' ? 'bg-green-100 text-green-800' :
                  record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Calendar className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="font-semibold">Request Leave</h3>
          <p className="text-sm text-gray-500">Apply for time off</p>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Clock3 className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="font-semibold">Request Overtime</h3>
          <p className="text-sm text-gray-500">Submit overtime request</p>
        </button>

        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <MessageSquare className="w-8 h-8 mb-2 text-blue-600" />
          <h3 className="font-semibold">Contact Supervisor</h3>
          <p className="text-sm text-gray-500">Send a message</p>
        </button>
      </div>

      {/* Payslip History Modal */}
      <Modal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        title="Payslip History"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <DataTable
            columns={payslipColumns}
            data={payslips.filter(p => 
              !selectedMonth || p.month.startsWith(selectedMonth)
            )}
          />
        </div>
      </Modal>
    </div>
  );
}