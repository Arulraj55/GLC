import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, BACKEND } from '../api';
import { useAuth } from '../context/AuthContext';

const roleConfig = {
  farmer:   { label: 'Farmer',     color: '#2e7d32', dark: '#1b5e20', icon: '🌾', redirect: '/farmer-dashboard', bg: 'GLC2.jpg' },
  shop:     { label: 'Shop Owner', color: '#1565c0', dark: '#0d47a1', icon: '🏪', redirect: '/shop-browse',      bg: 'GLC3.jpg' },
  customer: { label: 'Customer',   color: '#7c3aed', dark: '#6d28d9', icon: '🛒', redirect: '/market',           bg: 'GLC4.jpg' },
};

export default function Auth() {
  const { role } = useParams();
  const cfg = roleConfig[role] || roleConfig.customer;
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      let res;
      if (mode === 'login') {
        const creds = { username: form.username, password: form.password };
        if (role === 'farmer')        res = await api.login(creds);
        else if (role === 'shop')     res = await api.shopLogin(creds);
        else                          res = await api.customerLogin(creds);
      } else {
        if (role === 'farmer')        res = await api.signup(form);
        else if (role === 'shop')     res = await api.shopSignup(form);
        else                          res = await api.customerSignup(form);
      }

      if (res && res.success) {
        await refresh();
        navigate(cfg.redirect);
      } else {
        setError(res?.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Could not connect to server. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    { key: 'username', label: 'Username',  type: 'text',     show: true },
    { key: 'email',    label: 'Email',     type: 'email',    show: mode === 'signup' },
    { key: 'phone',    label: 'Phone',     type: 'tel',      show: mode === 'signup' },
    { key: 'city',     label: 'City',      type: 'text',     show: mode === 'signup' },
    { key: 'password', label: 'Password',  type: 'password', show: true },
  ].filter(f => f.show);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      fontFamily: 'Inter, Segoe UI, sans-serif',
    }}>
      {/* Left panel – image */}
      <div style={{
        flex: 1, display: 'none',
        background: `linear-gradient(135deg, ${cfg.dark}dd, ${cfg.color}cc),
                     url(${BACKEND}/${cfg.bg}) center/cover no-repeat`,
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 48, color: '#fff', minHeight: '100vh',
      }}
        className="auth-left-panel"
      >
        <div style={{ fontSize: 64, marginBottom: 24 }}>{cfg.icon}</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14 }}>
          {cfg.label} Portal
        </h2>
        <p style={{ fontSize: 16, opacity: .88, lineHeight: 1.7, textAlign: 'center', maxWidth: 320 }}>
          {role === 'farmer'   && 'Manage your crops, set prices, and sell directly to shops and customers.'}
          {role === 'shop'     && 'Source fresh produce from local farmers and manage your shop inventory.'}
          {role === 'customer' && 'Browse fresh products from local shops and get them delivered to your door.'}
        </p>
      </div>

      {/* Right panel – form */}
      <div style={{
        width: '100%', maxWidth: 480, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Back */}
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: cfg.color,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, padding: 0,
          }}>← Back to Home</button>

          {/* Icon + title */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64,
              background: cfg.color + '18',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, marginBottom: 16,
            }}>{cfg.icon}</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: cfg.dark, marginBottom: 6 }}>
              {mode === 'login' ? `${cfg.label} Login` : `Create Account`}
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Fill in your details to register.'}
            </p>
          </div>

          {/* Login / Sign Up tabs */}
          <div style={{
            display: 'flex', background: '#f3f4f6',
            borderRadius: 12, padding: 4, marginBottom: 24,
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
                cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: '.2s',
                background: mode === m ? cfg.color : 'transparent',
                color: mode === m ? '#fff' : '#6b7280',
              }}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
              padding: '12px 16px', borderRadius: 10, marginBottom: 20,
              fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600,
                  color: '#374151', marginBottom: 7,
                }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={set(f.key)}
                  required
                  placeholder={`Enter your ${f.label.toLowerCase()}`}
                  autoComplete={f.key === 'password' ? 'current-password' : f.key}
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '2px solid #e5e7eb', borderRadius: 12,
                    fontSize: 15, outline: 'none',
                    transition: '.2s', fontFamily: 'inherit',
                    background: '#fafafa',
                  }}
                  onFocus={e => { e.target.style.borderColor = cfg.color; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={busy}
              style={{
                padding: '14px', border: 'none', borderRadius: 12,
                background: busy ? '#9ca3af' : cfg.color,
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: busy ? 'not-allowed' : 'pointer',
                transition: '.2s', marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!busy) e.currentTarget.style.background = cfg.dark; }}
              onMouseLeave={e => { if (!busy) e.currentTarget.style.background = cfg.color; }}
            >
              {busy
                ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Please wait…</>
                : (mode === 'login' ? 'Login' : 'Create Account')
              }
            </button>
          </form>

          {/* Switch mode */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ color: cfg.color, fontWeight: 700, cursor: 'pointer' }}
            >
              {mode === 'login' ? 'Register here' : 'Login here'}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
