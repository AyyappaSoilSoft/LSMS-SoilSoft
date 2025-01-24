import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Home, Clock, Calendar, BarChart as ChartBar, Bell, User, LogOut, FileText, DollarSign, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

function getMenuItems(role: string) {
  const menuItems = {
    worker: [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Clock, label: 'Attendance', path: '/attendance' },
      { icon: Calendar, label: 'Leave', path: '/leave' },
      { icon: ChartBar, label: 'Performance', path: '/performance' },
      { icon: DollarSign, label: 'Salary History', path: '/salary' },
    ],
    supervisor: [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Clock, label: 'Attendance', path: '/attendance' },
      { icon: ChartBar, label: 'Performance', path: '/performance' },
      { icon: Calendar, label: 'Leave', path: '/leave' },
      { icon: Bell, label: 'Alerts', path: '/alerts' },
    ],
    manager: [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Clock, label: 'Attendance', path: '/attendance' },
      { icon: ChartBar, label: 'Performance', path: '/performance' },
      { icon: Calendar, label: 'Leave Approvals', path: '/leave' },
    ],
    accountant: [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: FileText, label: 'Invoices', path: '/invoices' },
      { icon: DollarSign, label: 'Payments', path: '/payments' },
    ],
  };

  return menuItems[role as keyof typeof menuItems] || [];
}

function Sidebar({ 
  isCollapsed, 
  onToggle, 
  isMobile, 
  isOpen, 
  onClose 
}: { 
  isCollapsed: boolean; 
  onToggle: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const { user } = useAuth();
  const menuItems = getMenuItems(user?.role || '');

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          bg-white border-r h-screen fixed left-0 top-0 z-30
          transition-all duration-300 
          ${isMobile 
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
            : `${isCollapsed ? 'w-20' : 'w-64'}`
          }
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {(!isCollapsed || isMobile) && (
              <h1 className="text-xl font-bold text-gray-800">LSMS</h1>
            )}
            <button 
              onClick={isMobile ? onClose : onToggle}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-transform ${
                isCollapsed && !isMobile ? 'ml-1' : 'ml-auto'
              }`}
            >
              {isMobile ? (
                <X size={20} className="text-gray-600" />
              ) : (
                isCollapsed ? (
                  <ChevronRight size={20} className="text-gray-600" />
                ) : (
                  <ChevronLeft size={20} className="text-gray-600" />
                )
              )}
            </button>
          </div>
          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 p-3 rounded-lg mb-1 ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={isCollapsed && !isMobile ? item.label : undefined}
              >
                <item.icon size={20} />
                {(!isCollapsed || isMobile) && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

function Header({ 
  isCollapsed, 
  isMobile, 
  onMenuClick 
}: { 
  isCollapsed: boolean;
  isMobile: boolean;
  onMenuClick: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <header 
      className={`
        h-16 bg-white border-b fixed top-0 right-0 z-10 
        transition-all duration-300
        ${isMobile ? 'left-0' : isCollapsed ? 'left-20' : 'left-64'}
      `}
    >
      <div className="flex items-center justify-between h-full px-6">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        )}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center space-x-2">
            <User size={20} className="text-gray-500" />
            <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function WorkerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <Header 
        isCollapsed={isCollapsed} 
        isMobile={isMobile}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <main 
        className={`
          pt-16 transition-all duration-300
          ${isMobile 
            ? 'ml-0' 
            : isCollapsed ? 'ml-20' : 'ml-64'
          }
        `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}