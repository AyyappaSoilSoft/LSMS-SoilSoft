import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import AdminLayout from './components/AdminLayout';
import WorkerLayout from './components/WorkerLayout';
import Login from './pages/Login';

// Import existing components
import Dashboard from './pages/Dashboard';
import LaborManagement from './pages/LaborManagement';
import FactoryManagement from './pages/FactoryManagement';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import PaymentManagement from './pages/PaymentManagement';
import AlertManagement from './pages/AlertManagement';
import WageManagement from './pages/WageManagement';
import LeaveManagement from './pages/LeaveManagement';

// Worker Routes
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerAttendance from './pages/worker/Attendance';
import WorkerLeave from './pages/worker/Leave';
import WorkerPerformance from './pages/worker/Performance';
import WorkerSalaryHistory from './pages/worker/SalaryHistory';

// Supervisor Routes
import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorAttendance from './pages/supervisor/Attendance';
import SupervisorPerformance from './pages/supervisor/Performance';
import SupervisorLeave from './pages/supervisor/Leave';

// Factory Manager Routes
import FactoryDashboard from './pages/factory/Dashboard';
import FactoryAttendance from './pages/factory/Attendance';
import FactoryPerformance from './pages/factory/Performance';

// Accountant Routes
import AccountsDashboard from './pages/accounts/Dashboard';
import AccountsInvoices from './pages/accounts/Invoices';
import AccountsPayments from './pages/accounts/Payments';

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        {user.role === 'admin' && (
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="labor" element={<LaborManagement />} />
            <Route path="factories" element={<FactoryManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="alerts" element={<AlertManagement />} />
            <Route path="wages" element={<WageManagement />} />
            <Route path="leave-approvals" element={<LeaveManagement />} />
          </Route>
        )}

        {/* Worker Routes */}
        {user.role === 'worker' && (
          <Route path="/" element={<WorkerLayout />}>
            <Route index element={<WorkerDashboard />} />
            <Route path="attendance" element={<WorkerAttendance />} />
            <Route path="leave" element={<WorkerLeave />} />
            <Route path="performance" element={<WorkerPerformance />} />
            <Route path="salary" element={<WorkerSalaryHistory />} />
          </Route>
        )}

        {/* Supervisor Routes */}
        {user.role === 'supervisor' && (
          <Route path="/" element={<WorkerLayout />}>
            <Route index element={<SupervisorDashboard />} />
            <Route path="attendance" element={<SupervisorAttendance />} />
            <Route path="performance" element={<SupervisorPerformance />} />
            <Route path="leave" element={<SupervisorLeave />} />
            <Route path="alerts" element={<AlertManagement />} />
          </Route>
        )}

        {/* Factory Manager Routes */}
        {user.role === 'manager' && (
          <Route path="/" element={<WorkerLayout />}>
            <Route index element={<FactoryDashboard />} />
            <Route path="attendance" element={<FactoryAttendance />} />
            <Route path="performance" element={<FactoryPerformance />} />
            <Route path="leave" element={<SupervisorLeave />} />
          </Route>
        )}

        {/* Accountant Routes */}
        {user.role === 'accountant' && (
          <Route path="/" element={<WorkerLayout />}>
            <Route index element={<AccountsDashboard />} />
            <Route path="invoices" element={<AccountsInvoices />} />
            <Route path="payments" element={<AccountsPayments />} />
          </Route>
        )}

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}