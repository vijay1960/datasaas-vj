import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Calendar, User, Shield, Sun, Moon, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ theme, toggleTheme, onOpenCommandPalette }) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-text-primary">DataSaaS</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${isActive ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50'}`}>
                  <Icon size={16} />{item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenCommandPalette} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-text-secondary text-sm hover:border-primary/50 transition-colors">
            <Search size={14} /><span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-background rounded text-xs font-mono">K</kbd>
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors relative">
            <Bell size={18} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          <button onClick={toggleTheme} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/account" className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium hover:bg-primary/30 transition-colors">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
