import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useFilters } from '../hooks/useFilters';
import { StatCard } from '../components/StatCard';
import { FilterBar } from '../components/FilterBar';
import { TaskTable } from '../components/TaskTable';
import { KanbanView } from '../components/KanbanView';
import { ListView } from '../components/ListView';
import { TaskModal } from '../components/TaskModal';
import { StatusChart, PriorityChart, ProjectChart } from '../components/Charts';
import { Toast } from '../components/Toast';
import { exportCSV } from '../utils/csvExport';
import { LayoutGrid, List, Table2, Download, Plus } from 'lucide-react';

export default function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useTasks();
  const { filters, updateFilter, resetFilters, filteredTasks, metrics } = useFilters(tasks);
  const [view, setView] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSave = (data) => {
    if (editingTask) { updateTask(editingTask.id, data); setToast({ message: 'Task updated', type: 'success' }); }
    else { addTask(data); setToast({ message: 'Task created', type: 'success' }); }
    setEditingTask(null);
  };

  const views = [
    { key: 'table', label: 'Table', icon: Table2 },
    { key: 'kanban', label: 'Kanban', icon: LayoutGrid },
    { key: 'list', label: 'List', icon: List }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-text-primary">Dashboard</h1><p className="text-sm text-text-secondary mt-1">Manage your tasks and projects</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => { exportCSV(tasks, filters); setToast({ message: 'CSV exported', type: 'success' }); }} className="btn btn-secondary btn-sm"><Download size={14} /> Export CSV</button>
          <button onClick={() => { setEditingTask(null); setModalOpen(true); }} className="btn btn-primary btn-sm"><Plus size={14} /> New Task</button>
        </div>
      </div>
      <div className="mb-6"><FilterBar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} /></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tasks" value={metrics.total} icon="📊" />
        <StatCard label="Completed" value={metrics.completed} trend={metrics.completionRate + '%'} trendUp={true} icon="✅" />
        <StatCard label="In Progress" value={metrics.inProgress} icon="🔄" />
        <StatCard label="Overdue" value={metrics.overdue} trend={metrics.overdue > 0 ? metrics.overdue + ' tasks' : 'None'} trendUp={metrics.overdue === 0} icon="⚠️" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <StatusChart tasks={filteredTasks} /><PriorityChart tasks={filteredTasks} /><ProjectChart tasks={filteredTasks} />
      </div>
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Tasks ({filteredTasks.length})</h2>
          <div className="flex items-center gap-1 bg-surface-hover rounded-lg p-1">
            {views.map(v => { const Icon = v.icon; return (
              <button key={v.key} onClick={() => setView(v.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === v.key ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                <Icon size={14} />{v.label}
              </button>
            ); })}
          </div>
        </div>
        {view === 'table' && <TaskTable tasks={filteredTasks} onEdit={t => { setEditingTask(t); setModalOpen(true); }} onDelete={id => { if (confirm('Delete?')) { deleteTask(id); setToast({ message: 'Deleted', type: 'info' }); } }} onComplete={completeTask} />}
        {view === 'kanban' && <KanbanView tasks={filteredTasks} onEdit={t => { setEditingTask(t); setModalOpen(true); }} onDelete={id => { if (confirm('Delete?')) { deleteTask(id); setToast({ message: 'Deleted', type: 'info' }); } }} onComplete={completeTask} />}
        {view === 'list' && <ListView tasks={filteredTasks} onEdit={t => { setEditingTask(t); setModalOpen(true); }} onDelete={id => { if (confirm('Delete?')) { deleteTask(id); setToast({ message: 'Deleted', type: 'info' }); } }} onComplete={completeTask} />}
      </div>
      <TaskModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} task={editingTask} onSave={handleSave} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
