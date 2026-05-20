import React, { useState, useEffect } from 'react';
import { Shield, Users, DollarSign, CreditCard, TrendingUp, Check, X, MessageCircle, Eye, EyeOff } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Admin() {
  const [stats, setStats] = useState({ total_users: 0, revenue: 0, approved_subscriptions: 0 });
  const [receipts, setReceipts] = useState([]);
  const [users, setUsers] = useState([]);
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('receipts');
  const [adminNotes, setAdminNotes] = useState({});
  const [showFullKeys, setShowFullKeys] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_BASE}/api/admin/dashboard`, { headers }).then(res => res.json()).then(data => setStats(data)).catch(() => {});
    fetch(`${API_BASE}/api/admin/receipts`, { headers }).then(res => res.json()).then(data => setReceipts(data.receipts || [])).catch(() => {});
    fetch(`${API_BASE}/api/admin/users`, { headers }).then(res => res.json()).then(data => setUsers(data.users || [])).catch(() => {});
    fetch(`${API_BASE}/api/admin/config`, { headers }).then(res => res.json()).then(data => setConfig(data)).catch(() => {});
  }, [token]);

  const handleApprove = async (receiptId) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/receipts/approve?id=${receiptId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ admin_notes: adminNotes[receiptId] || '' })
      });
      if (res.ok) {
        setReceipts(prev => prev.filter(r => r.id !== receiptId));
        fetch(`${API_BASE}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()).then(data => setStats(data));
      }
    } catch (err) { console.error('Failed to approve:', err); }
  };

  const handleReject = async (receiptId) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/receipts/reject?id=${receiptId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ admin_notes: adminNotes[receiptId] || 'Payment not verified.' })
      });
      if (res.ok) setReceipts(prev => prev.filter(r => r.id !== receiptId));
    } catch (err) { console.error('Failed to reject:', err); }
  };

  const pendingReceipts = receipts.filter(r => r.status === 'pending');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={28} className="text-primary" />
        <div><h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1><p className="text-sm text-text-secondary">Manage your SaaS platform</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card"><div className="flex items-center gap-2 text-text-secondary mb-2"><Users size={16} /><span className="text-sm">Total Users</span></div><div className="text-2xl font-bold text-text-primary font-mono">{stats.total_users}</div></div>
        <div className="card"><div className="flex items-center gap-2 text-text-secondary mb-2"><DollarSign size={16} /><span className="text-sm">Revenue</span></div><div className="text-2xl font-bold text-success font-mono">${stats.revenue.toLocaleString()}</div></div>
        <div className="card"><div className="flex items-center gap-2 text-text-secondary mb-2"><TrendingUp size={16} /><span className="text-sm">Subscriptions</span></div><div className="text-2xl font-bold text-text-primary font-mono">{stats.approved_subscriptions}</div></div>
        <div className="card"><div className="flex items-center gap-2 text-text-secondary mb-2"><CreditCard size={16} /><span className="text-sm">Pending</span></div><div className="text-2xl font-bold text-warning font-mono">{pendingReceipts.length}</div></div>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ key: 'receipts', label: 'Payment Receipts', count: pendingReceipts.length }, { key: 'users', label: 'Users' }, { key: 'config', label: 'Payment Config' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-surface-hover text-text-secondary hover:text-text-primary'}`}>
            {tab.label} {tab.count > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{tab.count}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'receipts' && (
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-4">Pending Payment Receipts</h3>
          {pendingReceipts.length === 0 ? <p className="text-text-secondary text-center py-8">No pending receipts</p> : (
            <div className="space-y-4">
              {pendingReceipts.map(receipt => (
                <div key={receipt.id} className="p-4 bg-surface-hover rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-text-primary">{receipt.email}</p>
                      <p className="text-sm text-text-secondary capitalize">{receipt.plan_type} plan - ${receipt.amount}</p>
                      <p className="text-xs text-text-secondary mt-1">Submitted: {new Date(receipt.submitted_at).toLocaleString()}</p>
                      {receipt.receipt_notes && <p className="text-xs text-text-secondary mt-1">Notes: {receipt.receipt_notes}</p>}
                    </div>
                    <a href={`https://wa.me/96899061298?text=${encodeURIComponent(`Payment receipt from ${receipt.email} for ${receipt.plan_type} plan ($${receipt.amount})`)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors" title="Contact on WhatsApp"><MessageCircle size={16} /></a>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Admin notes (optional)" value={adminNotes[receipt.id] || ''} onChange={e => setAdminNotes(prev => ({ ...prev, [receipt.id]: e.target.value }))} className="flex-1 input text-sm py-1.5" />
                    <button onClick={() => handleApprove(receipt.id)} className="btn btn-primary btn-sm flex items-center gap-1"><Check size={14} /> Approve</button>
                    <button onClick={() => handleReject(receipt.id)} className="btn btn-sm flex items-center gap-1 bg-danger/10 text-danger hover:bg-danger/20"><X size={14} /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-4">User Management</h3>
          <table className="table">
            <thead><tr><th>Email</th><th>Role</th><th>Plan</th><th>Trial End</th><th>Subscription End</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="font-medium text-text-primary">{user.email}</td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-surface-hover text-text-secondary'}`}>{user.role}</span></td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full ${user.plan === 'trial' ? 'bg-warning/20 text-warning' : user.plan === 'lifetime' ? 'bg-success/20 text-success' : user.plan === 'monthly' ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}`}>{user.plan}</span></td>
                  <td className="text-text-secondary text-sm">{user.trial_end ? new Date(user.trial_end).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-text-secondary text-sm">{user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-text-secondary text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'config' && config && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Payment Methods (Admin View - Full Details)</h3>
              <button onClick={() => setShowFullKeys(!showFullKeys)} className="p-2 hover:bg-surface-hover rounded-lg text-text-secondary">
                {showFullKeys ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-surface-hover rounded-lg"><p className="font-medium text-text-primary">PayPal</p><code className="text-sm text-text-secondary">{config.payment_methods.paypal.email}</code></div>
              <div className="p-3 bg-surface-hover rounded-lg"><p className="font-medium text-text-primary">Bankmuscat IBAN</p><code className="text-sm text-text-secondary">{showFullKeys ? config.payment_methods.iban.number : config.payment_methods.iban.number.replace(/\d{4}(?=\d{4})/g, 'xxxx')}</code></div>
              <div className="p-3 bg-surface-hover rounded-lg"><p className="font-medium text-text-primary">Stripe Publishable Key</p><code className="text-sm text-text-secondary font-mono break-all">{showFullKeys ? config.payment_methods.stripe.publishable_key : config.payment_methods.stripe.publishable_key.substring(0, 25) + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' + config.payment_methods.stripe.publishable_key.slice(-3)}</code></div>
              <div className="p-3 bg-surface-hover rounded-lg"><p className="font-medium text-text-primary">WhatsApp Contact</p><code className="text-sm text-text-secondary">{config.payment_methods.whatsapp.number}</code></div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-text-primary mb-4">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-surface-hover rounded-lg"><p className="font-medium text-text-primary">Monthly</p><p className="text-2xl font-bold text-primary">${config.pricing.monthly.price}</p><p className="text-sm text-text-secondary">{config.pricing.monthly.duration}</p></div>
              <div className="p-3 bg-surface-hover rounded-lg"><p className="font-medium text-text-primary">Lifetime</p><p className="text-2xl font-bold text-success">${config.pricing.lifetime.price}</p><p className="text-sm text-text-secondary">{config.pricing.lifetime.duration}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
