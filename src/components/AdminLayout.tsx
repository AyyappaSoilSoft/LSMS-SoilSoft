import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { 
  Users, 
  Factory, 
  FileText, 
  UserCog, 
  CreditCard, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
  Menu,
  Bell,
  User,
  LogOut,
  X,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { alerts } from '../lib/data';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  timestamp: string;
  read: boolean;
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
  
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Labor Management', path: '/labor' },
    { icon: Factory, label: 'Factory Management', path: '/factories' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: UserCog, label: 'User Management', path: '/users' },
    { icon: CreditCard, label: 'Payment Management', path: '/payments' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: DollarSign, label: 'Wage Management', path: '/wages' },
    { icon: Calendar, label: 'Leave Approvals', path: '/leave-approvals' },
  ];

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
          bg-gray-900 text-white h-screen fixed left-0 top-0 z-30
          transition-all duration-300 
          ${isMobile 
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
            : `${isCollapsed ? 'w-20' : 'w-64'}`
          }
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {(!isCollapsed || isMobile) && <h1 className="text-xl font-bold">LSMS</h1>}
            <button 
              onClick={isMobile ? onClose : onToggle}
              className={`p-2 hover:bg-gray-800 rounded-lg transition-transform ${
                isCollapsed && !isMobile ? 'ml-1' : 'ml-auto'
              }`}
            >
              {isMobile ? (
                <X size={20} />
              ) : (
                isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />
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
                  location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-800'
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

function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}: { 
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={onClearAll}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
          <button onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{notification.title}</h4>
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`${
                    notification.read ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                  }`}
                >
                  <Check size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return alerts.map(alert => ({
      id: alert.id,
      title: alert.type,
      message: alert.message,
      type: alert.severity === 'high' ? 'alert' : 
            alert.severity === 'medium' ? 'info' : 'success',
      timestamp: alert.createdAt,
      read: alert.status !== 'new'
    }));
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

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
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAll}
            />
          </div>
          <div className="flex items-center space-x-2">
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

export default function AdminLayout() {
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