import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);
    else setLoading(false);
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        fetchSubscription(token);
      } else {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setLoading(false);
    }
  };

  const fetchSubscription = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/api/payment/status`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setSubscription(await res.json());
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setSubscription({
      accessLevel: data.user.plan === 'trial' ? 'trial' : data.user.plan,
      trialEnd: data.user.trialEnd, subscriptionEnd: data.user.subscriptionEnd,
      trialDaysRemaining: data.user.trialEnd ? Math.max(0, Math.ceil((new Date(data.user.trialEnd) - new Date()) / 86400000)) : 0
    });
    return data;
  };

  const register = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setSubscription({
      accessLevel: 'trial', trialEnd: data.user.trialEnd,
      trialDaysRemaining: Math.ceil((new Date(data.user.trialEnd) - new Date()) / 86400000)
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSubscription(null);
  };

  const isExpired = () => {
    if (!subscription) return true;
    return subscription.accessLevel === 'expired' || subscription.accessLevel === 'none';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, subscription, isExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
