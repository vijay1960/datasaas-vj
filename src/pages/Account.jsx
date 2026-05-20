import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, CreditCard, Settings, LogOut, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Account() {
  const { user, logout, subscription } = useAuth();
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/api/payment/my-receipts`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json()).then(data => setReceipts(data.receipts || [])).catch(() => {});
    }
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">Pending Review</span>;
      case 'approved': return <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full">Approved</span>;
      case 'rejected': return <span className="px-2 py-1 bg-danger/20 text-danger text-xs rounded-full">Rejected</span>;
      default: return null;
    }
  };

  const getAccessBadge = () => {
    if (!subscription) return null;
    switch (subscription.accessLevel) {
      case 'trial': return <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-lg"><Clock size={14} className="text-warning" /><span className="text-sm text-warning">Trial - {subscription.trialDaysRemaining} days left</span></div>;
      case 'monthly': return <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg"><CheckCircle size={14} className="text-primary" /><span className="text-sm text-primary">Monthly Active</span></div>;
      case 'lifetime': return <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-lg"><CheckCircle size={14} className="text-success" /><span className="text-sm text-success">Lifetime Access</span></div>;
      default: return <div className="flex items-center gap-2 px-3 py-1.5 bg-danger/10 border border-danger/20 rounded-lg"><AlertCircle size={14} className="text-danger" /><span className="text-sm text-danger">Subscription Expired</span></div>;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Account</h1>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-bold">{user?.email?.charAt(0).toUpperCase()}</div>
            <div><h2 className="text-lg font-semibold text-text-primary">{user?.email}</h2><p className="text-sm text-text-secondary capitalize">{user?.role}</p></div>
          </div>
          {getAccessBadge()}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-surface-hover rounded-lg p-3"><p className="text-text-secondary">Member Since</p><p className="font-medium text-text-primary">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p></div>
          <div className="bg-surface-hover rounded-lg p-3"><p className="text-text-secondary">Trial Ends</p><p className="font-medium text-warning">{subscription?.trialEnd ? new Date(subscription.trialEnd).toLocaleDateString() : 'N/A'}</p></div>
        </div>
      </div>

      {(subscription?.accessLevel === 'expired' || (subscription?.accessLevel === 'trial' && subscription.trialDaysRemaining === 0)) ? (
        <div className="card mb-6 border-warning/30">
          <div className="flex items-start gap-3 mb-4"><AlertCircle size={20} className="text-warning mt-1 flex-shrink-0" /><div><h3 className="font-semibold text-text-primary">Your trial has expired</h3><p className="text-sm text-text-secondary mt-1">Subscribe to continue using DataSaaS</p></div></div>
          <button onClick={() => navigate('/payment')} className="btn btn-primary w-full">Subscribe Now</button>
        </div>
      ) : (
        <div className="card mb-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><CreditCard size={18} /> Subscription</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg"><div><p className="font-medium text-text-primary">Monthly Plan - $50/mo</p><p className="text-sm text-text-secondary">Full access, billed monthly</p></div><button onClick={() => navigate('/payment')} className="btn btn-primary btn-sm">Subscribe</button></div>
            <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg"><div><p className="font-medium text-text-primary">Lifetime Plan - $199</p><p className="text-sm text-text-secondary">One-time payment, forever access</p></div><button onClick={() => navigate('/payment')} className="btn btn-secondary btn-sm">Buy Now</button></div>
          </div>
        </div>
      )}

      {receipts.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><Clock size={18} /> Payment Receipts</h3>
          <div className="space-y-3">
            {receipts.map(receipt => (
              <div key={receipt.id} className="p-3 bg-surface-hover rounded-lg">
                <div className="flex items-center justify-between mb-2"><span className="font-medium text-text-primary capitalize">{receipt.plan_type} - ${receipt.amount}</span>{getStatusBadge(receipt.status)}</div>
                <p className="text-xs text-text-secondary">Submitted: {new Date(receipt.submitted_at).toLocaleDateString()}</p>
                {receipt.admin_notes && <p className="text-xs text-text-secondary mt-1">Note: {receipt.admin_notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2"><Settings size={18} /> Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg"><div><p className="font-medium text-text-primary">Email Notifications</p><p className="text-sm text-text-secondary">Receive task reminders</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div></label></div>
          <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg"><div><p className="font-medium text-text-primary">Dark Mode</p><p className="text-sm text-text-secondary">Use dark theme</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div></label></div>
        </div>
      </div>

      <button onClick={handleLogout} className="flex items-center gap-2 text-danger hover:text-danger/80 transition-colors"><LogOut size={18} />Sign Out</button>
    </div>
  );
}
