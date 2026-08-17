import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Building2,
  Home,
  Phone,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      success('Logged out successfully');
      navigate('/admin/login');
    } catch (err: any) {
      error(err.message || 'Logout failed');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Specialities', path: '/admin/specialities', icon: Sparkles },
    { name: 'Brands', path: '/admin/brands', icon: Building2 },
    { name: 'Homepage Content', path: '/admin/homepage', icon: Home },
    { name: 'Contact & Settings', path: '/admin/contact', icon: Phone },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Database & Tools', path: '/admin/settings', icon: Settings },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm">NEW PHARMA WORLD <span className="text-teal-400">ADMIN</span></span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-navy-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-navy-800">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-display font-extrabold text-white block tracking-tight">
                NEW PHARMA <span className="text-teal-400">WORLD</span>
              </span>
              <span className="text-[10px] text-teal-300 uppercase tracking-widest font-semibold block">
                Management Portal
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-navy-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-navy-800 space-y-3 bg-navy-950/50">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-teal-300 bg-navy-800 hover:bg-navy-700 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left overflow-hidden">
                <span className="text-xs font-semibold text-white block truncate">
                  {user?.displayName || 'Admin'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {user?.email || 'Authorized Owner'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-navy-800 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
