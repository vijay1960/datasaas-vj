export function exportCSV(tasks, filters) {
  const headers = ['Title', 'Description', 'Project', 'Category', 'Status', 'Priority', 'Due Date', 'Created'];
  const rows = tasks.map(t => [t.title, t.desc, t.project, t.category, t.status, t.priority, t.due, t.created]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.csv';
  a.click();
  URL.revokeObjectURL(url);
}
