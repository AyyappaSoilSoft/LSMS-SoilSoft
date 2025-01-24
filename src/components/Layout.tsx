import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
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
  User
} from 'lucide-react';

function Sidebar() {
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
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Supplier Admin</h1>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg mb-1 ${
                location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="h-16 bg-white border-b fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg">
            <User size={20} />
            <span>Admin User</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}