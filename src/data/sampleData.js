export const tasks = [
  { id: 1, title: 'Homepage Redesign', desc: 'Redesign homepage with new branding', project: 'Website Redesign', category: 'Frontend', status: 'done', priority: 'high', due: '2026-05-10', created: '2026-04-15', completed: '2026-05-08' },
  { id: 2, title: 'API Integration', desc: 'Integrate REST APIs for auth', project: 'Mobile App', category: 'Backend', status: 'progress', priority: 'urgent', due: '2026-05-15', created: '2026-04-20', completed: null },
  { id: 3, title: 'Social Media Campaign', desc: 'Plan Q3 social media posts', project: 'Q3 Marketing', category: 'Marketing', status: 'todo', priority: 'medium', due: '2026-05-25', created: '2026-05-01', completed: null },
  { id: 4, title: 'Database Migration', desc: 'Migrate MySQL to PostgreSQL', project: 'Website Redesign', category: 'Database', status: 'progress', priority: 'high', due: '2026-05-12', created: '2026-04-10', completed: null },
  { id: 5, title: 'Push Notifications', desc: 'Implement push notifications', project: 'Mobile App', category: 'Backend', status: 'hold', priority: 'low', due: '2026-06-01', created: '2026-04-25', completed: null },
];

export const projects = [
  { id: 1, name: 'Website Redesign', color: '#5e6ad2', description: 'Complete website overhaul' },
  { id: 2, name: 'Mobile App', color: '#f0a030', description: 'iOS and Android app' },
  { id: 3, name: 'Q3 Marketing', color: '#e5484d', description: 'Q3 marketing campaigns' }
];

export const categories = ['Frontend', 'Backend', 'Design', 'Marketing', 'Database', 'Security'];

export const statusConfig = {
  todo: { label: 'To Do', color: '#8a8d95' },
  progress: { label: 'In Progress', color: '#f0a030' },
  done: { label: 'Completed', color: '#39d39c' },
  hold: { label: 'On Hold', color: '#e5484d' }
};

export const priorityConfig = {
  low: { label: 'Low', color: '#3b82f6' },
  medium: { label: 'Medium', color: '#f0a030' },
  high: { label: 'High', color: '#f97316' },
  urgent: { label: 'Urgent', color: '#e5484d' }
};
