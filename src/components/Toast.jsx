import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);

  const icons = { success: <CheckCircle size={16} className="text-success" />, error: <AlertCircle size={16} className="text-danger" />, info: <Info size={16} className="text-info" /> };
  const borders = { success: 'border-success/30', error: 'border-danger/30', info: 'border-info/30' };

  return (
    <div className={`fixed bottom-4 right-4 z-50 card flex items-center gap-3 ${borders[type] || borders.info}`}>
      {icons[type] || icons.info}
      <span className="text-sm text-text-primary">{message}</span>
      <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary"><X size={14} /></button>
    </div>
  );
}
