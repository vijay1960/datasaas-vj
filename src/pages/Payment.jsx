import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCard, MessageCircle, Copy, Check, ArrowLeft, Clock, DollarSign, Shield } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Payment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', icon: '💳', details: 'Vijayaraghavan1960@gmail.com', instructions: 'Send payment via PayPal' },
    { id: 'iban', name: 'Bank Transfer (Bankmuscat)', icon: '🏦', details: 'OM76xxxxxxxxx520018', fullDetails: 'OM760270342000439520018', instructions: 'Transfer to IBAN at Bankmuscat' },
    { id: 'stripe', name: 'Stripe (Visa/Mastercard)', icon: '💎', details: 'pk_test_51T9gQs1y89aWCXv8xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxVfz', instructions: 'Use Stripe checkout' },
  ];

  const plans = [
    { id: 'monthly', name: 'Monthly', price: 50, duration: '1 month access', features: ['Unlimited tasks', 'Unlimited projects', 'Advanced filters', 'CSV export'] },
    { id: 'lifetime', name: 'Lifetime', price: 199, duration: 'Forever access', features: ['Everything forever', 'All future updates', 'Priority support', 'Unlimited everything'] },
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleWhatsApp = (plan) => {
    setSelectedPlan(plan);
    const message = encodeURIComponent(`Hi! I want to subscribe to DataSaaS ${plan.name} plan ($${plan.price}). I will send payment receipt to this number.`);
    window.open(`https://wa.me/96899061298?text=${message}`, '_blank');
  };

  const handleSubmitReceipt = async () => {
    if (!selectedPlan) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/payment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan_type: selectedPlan.id, amount: selectedPlan.price, receipt_notes: `Payment via ${paymentMethods.map(m => m.name).join(', ')}` })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to submit receipt. Please try again.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="card text-center max-w-md">
          <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Receipt Submitted!</h2>
          <p className="text-text-secondary mb-6">Send your payment proof to WhatsApp <strong>968-99061298</strong>. Admin will activate your {selectedPlan?.name} subscription within 24 hours.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary w-full">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-6 h-14 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">D</span></div><span className="font-semibold text-text-primary">DataSaaS</span></Link>
          <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"><ArrowLeft size={14} />Back</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text-primary mb-3">Subscribe to DataSaaS</h1>
          <p className="text-text-secondary">Choose your plan and pay using any method below</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {plans.map(plan => (
            <div key={plan.id} className={`card cursor-pointer transition-all ${selectedPlan?.id === plan.id ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/30'}`} onClick={() => setSelectedPlan(plan)}>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-text-primary mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary my-4">${plan.price}</div>
                <p className="text-sm text-text-secondary mb-4">{plan.duration}</p>
                <ul className="text-sm text-text-secondary space-y-2 mb-6 text-left">
                  {plan.features.map((f, i) => (<li key={i} className="flex items-center gap-2"><Check size={14} className="text-success" />{f}</li>))}
                </ul>
                <button className={`btn w-full ${selectedPlan?.id === plan.id ? 'btn-primary' : 'btn-secondary'}`} onClick={(e) => { e.stopPropagation(); handleWhatsApp(plan); }}>Select {plan.name} Plan</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2"><CreditCard size={20} className="text-primary" /> Payment Methods</h2>
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div key={method.id} className="p-4 bg-surface-hover rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div><h3 className="font-medium text-text-primary">{method.name}</h3><p className="text-sm text-text-secondary">{method.instructions}</p></div>
                  </div>
                  <button onClick={() => handleCopy(method.fullDetails || method.details, method.id)} className="p-2 hover:bg-surface rounded-lg transition-colors" title="Copy">
                    {copied === method.id ? <Check size={16} className="text-success" /> : <Copy size={16} className="text-text-secondary" />}
                  </button>
                </div>
                <code className="text-sm bg-background px-3 py-1.5 rounded text-text-primary font-mono block">{method.details}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8 border-warning/30">
          <div className="flex items-start gap-4">
            <Clock size={24} className="text-warning mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text-primary mb-2">How to Activate Your Account</h3>
              <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
                <li>Choose your plan (Monthly $50 or Lifetime $199)</li>
                <li>Send payment using any method above</li>
                <li>Send payment receipt via WhatsApp to <strong className="text-text-primary">968-99061298</strong></li>
                <li>Click "I've Sent Payment" below to notify the system</li>
                <li>Admin will verify and activate within 24 hours</li>
              </ol>
            </div>
          </div>
        </div>

        {selectedPlan && (
          <button onClick={handleSubmitReceipt} disabled={submitting} className="btn btn-primary w-full mb-8 py-3 text-base">
            {submitting ? 'Submitting...' : `I've Sent Payment - ${selectedPlan.name} ($${selectedPlan.price})`}
          </button>
        )}

        <div className="card border-success/30">
          <div className="flex items-center gap-4">
            <MessageCircle size={24} className="text-success flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text-primary">Need Help?</h3>
              <p className="text-sm text-text-secondary">Contact us on WhatsApp: <a href="https://wa.me/96899061298" className="text-success hover:underline" target="_blank" rel="noopener noreferrer">968-99061298</a></p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-text-secondary">
        <p>© 2026 DataSaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
