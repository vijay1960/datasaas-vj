import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, verifying, success, error
  const [message, setMessage] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyWithToken(token);
    }
  }, []);

  const verifyWithToken = async (token) => {
    setStatus('verifying');
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) return;
    setStatus('verifying');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendStatus('sending');
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setResendStatus('sent');
        setMessage('New verification code sent!');
        setTimeout(() => setResendStatus(''), 3000);
      } else {
        setResendStatus('');
        setMessage(data.error);
      }
    } catch (err) {
      setResendStatus('');
      setMessage('Failed to resend. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="card">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
            <h1 className="text-xl font-bold text-text-primary mb-2">Email Verified!</h1>
            <p className="text-text-secondary mb-4">{message}</p>
            <p className="text-sm text-text-secondary">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/signup" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"><ArrowLeft size={16} />Back to signup</Link>
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Verify Your Email</h1>
            <p className="text-sm text-text-secondary mt-1">
              {email ? `We sent a code to ${email}` : 'Enter the email you signed up with'}
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 border rounded-lg text-sm ${status === 'error' ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
              {status === 'error' && <AlertCircle size={14} className="inline mr-1" />}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!searchParams.get('email') && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Verification Code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} className="input" placeholder="Enter 6-digit code" required maxLength={6} pattern="[0-9]{6}" />
              <p className="text-xs text-text-secondary mt-1">Check your email inbox (and spam folder)</p>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={status === 'verifying'}>
              {status === 'verifying' ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={handleResend} className="text-sm text-primary hover:underline" disabled={resendStatus === 'sending'}>
              {resendStatus === 'sending' ? 'Sending...' : resendStatus === 'sent' ? 'Code sent!' : "Didn't receive a code? Resend"}
            </button>
          </div>

          <p className="text-center text-sm text-text-secondary mt-4">
            Already verified? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
