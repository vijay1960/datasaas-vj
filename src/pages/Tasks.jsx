import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useFilters } from '../hooks/useFilters';
import { TaskTable } from '../components/TaskTable';
import { TaskModal } from '../components/TaskModal';
import { FilterBar } from '../components/FilterBar';
import { Toast } from '../components/Toast';
import { Plus, Download } from 'lucide-react';
import { exportCSV } from '../utils/csvExport';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useTasks();
  const { filters, updateFilter, resetFilters, filteredTasks } = useFilters(tasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSave = (data) => {
    if (editingTask) { updateTask(editingTask.id, data); setToast({ message: 'Task updated', type: 'success' }); }
    else { addTask(data); setToast({ message: 'Task created', type: 'success' }); }
    setEditingTask(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-text-primary">Tasks</h1><p className="text-sm text-text-secondary mt-1">{filteredTasks.length} tasks found</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => { exportCSV(tasks, filters); setToast({ message: 'CSV exported', type: 'success' }); }} className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
          <button onClick={() => { setEditingTask(null); setModalOpen(true); }} className="btn btn-primary btn-sm"><Plus size={14} /> New Task</button>
        </div>
      </div>
      <div className="mb-6"><FilterBar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} /></div>
      <div className="card"><TaskTable tasks={filteredTasks} onEdit={t => { setEditingTask(t); setModalOpen(true); }} onDelete={id => { if (confirm('Delete?')) { deleteTask(id); setToast({ message: 'Deleted', type: 'info' }); } }} onComplete={completeTask} /></div>
      <TaskModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} task={editingTask} onSave={handleSave} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
