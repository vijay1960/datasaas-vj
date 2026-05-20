import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { projects, categories } from '../data/sampleData';

export function TaskModal({ isOpen, onClose, task, onSave }) {
  const [form, setForm] = useState({ title: '', desc: '', project: '', category: '', status: 'todo', priority: 'medium', due: '' });

  useEffect(() => {
    if (task) setForm({ title: task.title || '', desc: task.desc || '', project: task.project || '', category: task.category || '', status: task.status || 'todo', priority: task.priority || 'medium', due: task.due || '' });
    else setForm({ title: '', desc: '', project: '', category: '', status: 'todo', priority: 'medium', due: '' });
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="card w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Title *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" required /></div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Description</label><textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="input" rows={3} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Project</label><select value={form.project} onChange={e => setForm({...form, project: e.target.value})} className="input">{projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input"><option value="todo">To Do</option><option value="progress">In Progress</option><option value="done">Completed</option><option value="hold">On Hold</option></select></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Priority</label><select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="input"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-text-secondary mb-1">Due Date</label><input type="date" value={form.due} onChange={e => setForm({...form, due: e.target.value})} className="input" /></div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn btn-primary flex-1">Save</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
