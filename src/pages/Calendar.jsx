import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { tasks } from '../data/sampleData';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.due === dateStr);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 hover:bg-surface-hover rounded-lg"><ChevronLeft size={20} /></button>
          <span className="text-lg font-medium text-text-primary">{monthName}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 hover:bg-surface-hover rounded-lg"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="card">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center text-xs font-medium text-text-secondary py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            return (
              <div key={i} className={`min-h-[80px] p-2 rounded-lg border ${isToday ? 'border-primary bg-primary/5' : 'border-border'} ${!day ? 'opacity-30' : ''}`}>
                {day && <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-text-secondary'}`}>{day}</span>}
                {dayTasks.map(t => <div key={t.id} className="text-xs mt-1 px-1 py-0.5 bg-primary/20 text-primary rounded truncate">{t.title}</div>)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
