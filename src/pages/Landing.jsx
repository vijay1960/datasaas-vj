import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: Zap, title: 'Fast & Efficient', desc: 'Manage tasks with keyboard shortcuts and inline editing' },
    { icon: Shield, title: 'Secure', desc: 'Your data is encrypted and protected' },
    { icon: BarChart3, title: 'Analytics', desc: 'Track progress with interactive charts' },
  ];

  return (
    <div>
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-6 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">D</span></div>
            <span className="font-semibold text-text-primary">DataSaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      <section className="text-center py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"><Zap size={14} />AI-powered task management</div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">Manage tasks with <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">precision</span></h1>
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">A powerful project management tool with filtering, analytics, and collaboration. Start your free 3-day trial today.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="btn btn-primary px-8 py-3 text-base">Sign Up Free <ArrowRight size={18} /></Link>
            <Link to="/payment" className="btn btn-secondary px-8 py-3 text-base">View Pricing</Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => { const Icon = f.icon; return (
            <div key={i} className="card hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4"><Icon size={20} className="text-primary" /></div>
              <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.desc}</p>
            </div>
          ); })}
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">Simple, transparent pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="font-semibold text-text-primary mb-2">Free Trial</h3>
            <div className="text-4xl font-bold text-text-primary my-4">$0</div>
            <p className="text-sm text-text-secondary mb-6">3 days full access</p>
            <ul className="text-sm text-text-secondary space-y-2 mb-6 text-left">
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Up to 20 tasks</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />2 projects</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Basic filters</li>
            </ul>
            <Link to="/signup" className="btn btn-secondary w-full">Sign Up Free</Link>
          </div>
          <div className="card text-center border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">Popular</div>
            <h3 className="font-semibold text-text-primary mb-2">Monthly</h3>
            <div className="text-4xl font-bold text-primary my-4">$50<span className="text-base text-text-secondary">/mo</span></div>
            <p className="text-sm text-text-secondary mb-6">Full access, cancel anytime</p>
            <ul className="text-sm text-text-secondary space-y-2 mb-6 text-left">
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Unlimited tasks</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Unlimited projects</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Advanced filters</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />CSV export</li>
            </ul>
            <Link to="/payment" className="btn btn-primary w-full">Subscribe</Link>
          </div>
          <div className="card text-center">
            <h3 className="font-semibold text-text-primary mb-2">Lifetime</h3>
            <div className="text-4xl font-bold text-text-primary my-4">$199</div>
            <p className="text-sm text-text-secondary mb-6">One-time payment</p>
            <ul className="text-sm text-text-secondary space-y-2 mb-6 text-left">
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Everything forever</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />All future updates</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-success" />Priority support</li>
            </ul>
            <Link to="/payment" className="btn btn-secondary w-full">Buy Now</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-text-secondary">
        <p>© 2026 DataSaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
