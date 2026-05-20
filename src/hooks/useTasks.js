import { useState, useCallback } from 'react';
import { tasks as initialTasks } from '../data/sampleData';

export function useTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [nextId, setNextId] = useState(initialTasks.length + 1);

  const addTask = useCallback((taskData) => {
    const newTask = { id: nextId, ...taskData, created: new Date().toISOString().split('T')[0], completed: null };
    setTasks(prev => [...prev, newTask]);
    setNextId(prev => prev + 1);
    return newTask;
  }, [nextId]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const completeTask = useCallback((id) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, status: 'done', completed: new Date().toISOString().split('T')[0] } : task));
  }, []);

  return { tasks, addTask, updateTask, deleteTask, completeTask };
}
