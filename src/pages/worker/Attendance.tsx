import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import DataTable from '../../components/DataTable';

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late';
  workHours: number;
}

export default function WorkerAttendance() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Mock attendance data
  const attendanceRecords: AttendanceRecord[] = [
    {
      date: '2024-03-20',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: 'present',
      workHours: 9,
    },
    {
      date: '2024-03-19',
      checkIn: '09:15 AM',
      checkOut: '06:00 PM',
      status: 'late',
      workHours: 8.75,
    },
    // Add more records as needed
  ];

  const columns = [
    { 
      key: 'date', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
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
  ];

  const handleCheckInOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    if (!isCheckedIn) {
      setCheckInTime(timeString);
    }
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Attendance</h1>

      {/* Check In/Out Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">Today's Status</h2>
              <p className="text-gray-500">
                {isCheckedIn ? `Checked in at ${checkInTime}` : 'Not checked in'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCheckInOut}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Monthly Overview</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" />
              <span className="text-gray-600">Present Days</span>
            </div>
            <p className="text-2xl font-semibold mt-2">18</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="text-red-600" />
              <span className="text-gray-600">Absent Days</span>
            </div>
            <p className="text-2xl font-semibold mt-2">2</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="text-yellow-600" />
              <span className="text-gray-600">Late Days</span>
            </div>
            <p className="text-2xl font-semibold mt-2">1</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="text-blue-600" />
              <span className="text-gray-600">Working Days</span>
            </div>
            <p className="text-2xl font-semibold mt-2">21</p>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Attendance History</h2>
        <DataTable columns={columns} data={attendanceRecords} />
      </div>
    </div>
  );
}