import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { statusConfig, priorityConfig } from '../data/sampleData';

export function ListView({ tasks, onEdit, onDelete, onComplete }) {
  if (tasks.length === 0) return <p className="text-center text-text-secondary py-8">No tasks found</p>;
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="flex items-center gap-4 p-3 bg-surface-hover rounded-lg">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusConfig[task.status]?.color }}></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
            <p className="text-xs text-text-secondary">{task.project} · {task.category}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: priorityConfig[task.priority]?.color + '20', color: priorityConfig[task.priority]?.color }}>{priorityConfig[task.priority]?.label}</span>
          <span className="text-xs text-text-secondary flex-shrink-0">{task.due}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {task.status !== 'done' && <button onClick={() => onComplete(task.id)} className="p-1 text-success hover:bg-success/10 rounded"><Check size={14} /></button>}
            <button onClick={() => onEdit(task)} className="p-1 text-text-secondary hover:text-text-primary"><Edit2 size={14} /></button>
            <button onClick={() => onDelete(task.id)} className="p-1 text-danger hover:bg-danger/10"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
