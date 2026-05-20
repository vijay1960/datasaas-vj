import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Calendar, User, Shield, Plus, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ onNewTask }) {
  const location = useLocation();
  const { user, subscription } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/account', label: 'Account', icon: User },
  ];

  if (user?.role === 'admin') navItems.push({ path: '/admin', label: 'Admin', icon: Shield });

  const getStatusInfo = () => {
    if (!subscription) return { label: 'Loading...', color: 'text-text-secondary', width: '0%' };
    switch (subscription.accessLevel) {
      case 'trial': return { label: `Trial - ${subscription.trialDaysRemaining} days`, color: 'text-warning', width: `${(subscription.trialDaysRemaining / 3) * 100}%` };
      case 'monthly': return { label: 'Monthly Active', color: 'text-primary', width: '100%' };
      case 'lifetime': return { label: 'Lifetime Access', color: 'text-success', width: '100%' };
      default: return { label: 'Expired', color: 'text-danger', width: '0%' };
    }
  };

  const status = getStatusInfo();

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-surface/50 p-3">
      <button onClick={onNewTask} className="flex items-center gap-2 w-full px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors mb-4">
        <Plus size={16} />New Task
      </button>
      <nav className="flex flex-col gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50'}`}>
              <Icon size={16} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            {subscription?.accessLevel === 'trial' ? <Clock size={12} className="text-warning" /> : <CheckCircle size={12} className={status.color} />}
            <p className={`text-xs font-medium ${status.color}`}>{status.label}</p>
          </div>
          <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${status.accessLevel === 'trial' ? 'bg-warning' : status.accessLevel === 'monthly' ? 'bg-primary' : 'bg-success'}`} style={{ width: status.width }}></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
