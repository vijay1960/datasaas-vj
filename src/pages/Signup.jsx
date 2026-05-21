import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate(`/verify-email?email=${encodeURIComponent(email)}&token=${data.verificationToken}`);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"><ArrowLeft size={16} />Back to home</Link>
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-xl">D</span></div>
            <h1 className="text-xl font-bold text-text-primary">Sign Up</h1>
            <p className="text-sm text-text-secondary mt-1">Start your free 3-day trial</p>
          </div>
          {error && <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required /></div>
            <div><label className="block text-sm font-medium text-text-secondary mb-1">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="Min 6 characters" required minLength={6} /></div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up Free'}</button>
          </form>
          <p className="text-center text-sm text-text-secondary mt-4">Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
