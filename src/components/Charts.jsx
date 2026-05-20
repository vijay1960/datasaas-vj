import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { statusConfig, priorityConfig } from '../data/sampleData';

const COLORS = ['#5e6ad2', '#f0a030', '#39d39c', '#e5484d', '#3b82f6', '#8a8d95'];

export function StatusChart({ tasks }) {
  const data = Object.entries(statusConfig).map(([key, config]) => ({
    name: config.label, value: tasks.filter(t => t.status === key).length
  }));
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-text-secondary mb-3">By Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="#5e6ad2" radius={[4, 4, 0, 0]} /></BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriorityChart({ tasks }) {
  const data = Object.entries(priorityConfig).map(([key, config]) => ({
    name: config.label, value: tasks.filter(t => t.priority === key).length
  }));
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-text-secondary mb-3">By Priority</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">{data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProjectChart({ tasks }) {
  const projectNames = [...new Set(tasks.map(t => t.project))];
  const data = projectNames.map(name => ({ name, value: tasks.filter(t => t.project === name).length }));
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-text-secondary mb-3">By Project</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="#39d39c" radius={[4, 4, 0, 0]} /></BarChart>
      </ResponsiveContainer>
    </div>
  );
}
