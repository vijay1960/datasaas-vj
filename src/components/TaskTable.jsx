import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { statusConfig, priorityConfig } from '../data/sampleData';

export function TaskTable({ tasks, onEdit, onDelete, onComplete }) {
  if (tasks.length === 0) return <p className="text-center text-text-secondary py-8">No tasks found</p>;
  return (
    <table className="table">
      <thead><tr><th>Title</th><th>Project</th><th>Status</th><th>Priority</th><th>Due</th><th>Actions</th></tr></thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            <td className="font-medium text-text-primary">{task.title}</td>
            <td className="text-text-secondary">{task.project}</td>
            <td><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusConfig[task.status]?.color + '20', color: statusConfig[task.status]?.color }}>{statusConfig[task.status]?.label}</span></td>
            <td><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: priorityConfig[task.priority]?.color + '20', color: priorityConfig[task.priority]?.color }}>{priorityConfig[task.priority]?.label}</span></td>
            <td className="text-text-secondary text-sm">{task.due}</td>
            <td>
              <div className="flex items-center gap-1">
                {task.status !== 'done' && <button onClick={() => onComplete(task.id)} className="p-1 text-success hover:bg-success/10 rounded" title="Complete"><Check size={14} /></button>}
                <button onClick={() => onEdit(task)} className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded" title="Edit"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(task.id)} className="p-1 text-danger hover:bg-danger/10 rounded" title="Delete"><Trash2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
