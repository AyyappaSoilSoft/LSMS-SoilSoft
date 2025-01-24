import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import DataTable from '../../components/DataTable';
import { workers } from '../../lib/data';
import Modal from '../../components/Modal';

interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late';
  workHours: number;
}

export default function SupervisorAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  // Mock attendance data
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    workers.map(worker => ({
      id: worker.id,
      name: worker.name,
      date: selectedDate,
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'late' : 'absent',
      workHours: 9,
    }))
  );

  const handleUpdateAttendance = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsUpdateModalOpen(true);
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Name', 'Date', 'Check In', 'Check Out', 'Status', 'Work Hours'].join(','),
      ...attendanceRecords.map(record => 
        [record.name, record.date, record.checkIn, record.checkOut, record.status, record.workHours].join(',')
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

  const handleSaveUpdate = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => 
      prev.map(r => r.id === record.id ? record : r)
    );
    setIsUpdateModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    { key: 'name', label: 'Name' },
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
    { 
      key: 'workHours', 
      label: 'Work Hours',
      render: (value: number) => `${value} hrs`
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, record: AttendanceRecord) => (
        <button 
          onClick={() => handleUpdateAttendance(record)}
          className="text-blue-600 hover:text-blue-800"
        >
          Update
        </button>
      )
    }
  ];

  const filteredRecords = attendanceRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Team Attendance</h1>

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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Export Report
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
          <p className="text-2xl font-semibold mt-2">
            {attendanceRecords.filter(r => r.status === 'present').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <XCircle className="text-red-600" />
            <span className="text-gray-600">Absent</span>
          </div>
          <p className="text-2xl font-semibold mt-2">
            {attendanceRecords.filter(r => r.status === 'absent').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Clock className="text-yellow-600" />
            <span className="text-gray-600">Late</span>
          </div>
          <p className="text-2xl font-semibold mt-2">
            {attendanceRecords.filter(r => r.status === 'late').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" />
            <span className="text-gray-600">Total Workers</span>
          </div>
          <p className="text-2xl font-semibold mt-2">{attendanceRecords.length}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Attendance</h2>
        <DataTable columns={columns} data={filteredRecords} />
      </div>

      {/* Update Attendance Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedRecord(null);
        }}
        title="Update Attendance"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Worker Name</label>
              <p className="mt-1 text-gray-900">{selectedRecord.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={selectedRecord.status}
                onChange={(e) => setSelectedRecord({
                  ...selectedRecord,
                  status: e.target.value as 'present' | 'absent' | 'late'
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Check In Time</label>
              <input
                type="time"
                value={selectedRecord.checkIn}
                onChange={(e) => setSelectedRecord({
                  ...selectedRecord,
                  checkIn: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Check Out Time</label>
              <input
                type="time"
                value={selectedRecord.checkOut}
                onChange={(e) => setSelectedRecord({
                  ...selectedRecord,
                  checkOut: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleSaveUpdate(selectedRecord)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedRecord(null);
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