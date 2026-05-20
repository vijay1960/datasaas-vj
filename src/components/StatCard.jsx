import React from 'react';

export function StatCard({ label, value, trend, trendUp, icon }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-text-primary font-mono">{value}</div>
      {trend && <div className={`text-xs mt-1 ${trendUp !== false ? 'text-success' : 'text-danger'}`}>{trend}</div>}
    </div>
  );
}
