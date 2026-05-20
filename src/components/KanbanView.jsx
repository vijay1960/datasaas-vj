import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { statusConfig, priorityConfig } from '../data/sampleData';

export function KanbanView({ tasks, onEdit, onDelete, onComplete }) {
  const columns = Object.entries(statusConfig).map(([key, config]) => ({
    key, ...config, tasks: tasks.filter(t => t.status === key)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map(col => (
        <div key={col.key} className="bg-surface-hover rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }}></div>
            <h3 className="text-sm font-medium text-text-primary">{col.label}</h3>
            <span className="text-xs text-text-secondary ml-auto">{col.tasks.length}</span>
          </div>
          <div className="space-y-2">
            {col.tasks.map(task => (
              <div key={task.id} className="bg-surface border border-border rounded-lg p-3">
                <p className="text-sm font-medium text-text-primary mb-1">{task.title}</p>
                <p className="text-xs text-text-secondary mb-2">{task.project}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: priorityConfig[task.priority]?.color + '20', color: priorityConfig[task.priority]?.color }}>{priorityConfig[task.priority]?.label}</span>
                  <div className="flex items-center gap-1">
                    {task.status !== 'done' && <button onClick={() => onComplete(task.id)} className="p-1 text-success hover:bg-success/10 rounded"><Check size={12} /></button>}
                    <button onClick={() => onEdit(task)} className="p-1 text-text-secondary hover:text-text-primary"><Edit2 size={12} /></button>
                    <button onClick={() => onDelete(task.id)} className="p-1 text-danger hover:bg-danger/10"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
