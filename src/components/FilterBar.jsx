import React from 'react';
import { Search, X } from 'lucide-react';
import { statusConfig, priorityConfig } from '../data/sampleData';

export function FilterBar({ filters, updateFilter, resetFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input type="text" placeholder="Search tasks..." value={filters.search} onChange={e => updateFilter('search', e.target.value)}
          className="input pl-9" />
      </div>
      <select value={filters.status} onChange={e => updateFilter('status', e.target.value)} className="input w-auto">
        <option value="">All Status</option>
        {Object.entries(statusConfig).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
      </select>
      <select value={filters.priority} onChange={e => updateFilter('priority', e.target.value)} className="input w-auto">
        <option value="">All Priority</option>
        {Object.entries(priorityConfig).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
      </select>
      <button onClick={resetFilters} className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}
