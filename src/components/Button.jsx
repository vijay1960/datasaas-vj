import React from 'react';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = { primary: 'bg-primary text-white hover:bg-primary-hover', secondary: 'bg-surface-hover text-text-primary hover:bg-border border border-border' };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2' };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}

export function Badge({ children, color = 'primary' }) {
  return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: color + '20', color }}>{children}</span>;
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="card w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CommandPalette({ isOpen, onClose, theme, toggleTheme, onNewTask }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50" onClick={onClose}>
      <div className="card w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <input type="text" placeholder="Type a command or search..." className="input text-lg border-0 bg-transparent focus:ring-0" autoFocus />
        <div className="mt-3 space-y-1">
          <button onClick={() => { onNewTask(); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
            <span>＋</span> New Task
          </button>
          <button onClick={() => { toggleTheme(); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
            <span>{theme === 'dark' ? '☀' : '☾'}</span> Toggle Theme
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-3 text-center">Press ESC to close</p>
      </div>
    </div>
  );
}
