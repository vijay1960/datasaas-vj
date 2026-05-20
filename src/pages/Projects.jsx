import React from 'react';
import { projects } from '../data/sampleData';
import { Plus } from 'lucide-react';

export default function Projects() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-text-primary">Projects</h1><p className="text-sm text-text-secondary mt-1">{projects.length} active projects</p></div>
        <button className="btn btn-primary btn-sm"><Plus size={14} /> New Project</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="card hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }}></div>
              <h3 className="font-semibold text-text-primary">{project.name}</h3>
            </div>
            <p className="text-sm text-text-secondary">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
