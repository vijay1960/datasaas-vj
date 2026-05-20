import { useState, useMemo } from 'react';

export function useFilters(tasks) {
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', project: '', category: '' });

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const resetFilters = () => setFilters({ search: '', status: '', priority: '', project: '', category: '' });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.project && task.project !== filters.project) return false;
      if (filters.category && task.category !== filters.category) return false;
      return true;
    });
  }, [tasks, filters]);

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'progress').length;
    const overdue = tasks.filter(t => t.status !== 'done' && new Date(t.due) < new Date()).length;
    return { total, completed, inProgress, overdue, completionRate: total ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  return { filters, updateFilter, resetFilters, filteredTasks, metrics };
}
