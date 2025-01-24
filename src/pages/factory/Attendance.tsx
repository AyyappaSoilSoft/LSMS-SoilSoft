import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { workers } from '../../lib/data';

interface AttendanceRecord {
  id: string;
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late';
  supervisor: string;
}

export default function FactoryAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock attendance data
  const [attendanceRecords] = useState<AttendanceRecord[]>(
    workers.map(worker => ({
      id: worker.id,
      name: worker.name,
      department: ['Production', 'Assembly', 'Quality Control'][Math.floor(Math.random() * 3)],
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'late' : 'absent',
      supervisor: worker.supervisor || 'Unassigned',
    }))
  );

  const departments = ['Production', 'Assembly', 'Quality Control'];

  const handleExportReport = () => {
    const csvContent = [
      ['Name', 'Department', 'Check In', 'Check Out', 'Status', 'Supervisor'].join(','),
      ...filteredRecords.map(record => 
        [record.name, record.department, record.checkIn, record.checkOut, record.status, record.supervisor].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'present' ? 'bg-green-100 text-green-800' :
          value === 'late' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'supervisor', label: 'Supervisor' },
  ];

  const filteredRecords = attendanceRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === 'all' || record.department === selectedDepartment)
  );

  const stats = {
    present: filteredRecords.filter(r => r.status === 'present').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    late: filteredRecords.filter(r => r.status === 'late').length,
    total: filteredRecords.length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Factory Attendance</h1>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <button 
            onClick={handleExportReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" />
            <span className="text-gray-600">Present</span>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.present}</p>
          <p className="text-sm text-gray-500">{Math.round((stats.present / stats.total) * 100)}% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <XCircle className="text-red-600" />
            <span className="text-gray-600">Absent</span>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.absent}</p>
          <p className="text-sm text-gray-500">{Math.round((stats.absent / stats.total) * 100)}% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Clock className="text-yellow-600" />
            <span className="text-gray-600">Late</span>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.late}</p>
          <p className="text-sm text-gray-500">{Math.round((stats.late / stats.total) * 100)}% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" />
            <span className="text-gray-600">Total Workers</span>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.total}</p>
          <p className="text-sm text-gray-500">Across all departments</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
        <DataTable columns={columns} data={filteredRecords} />
      </div>
    </div>
  );
}