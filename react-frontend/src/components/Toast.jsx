import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: '#10b981', icon: '✓' },
    error:   { bg: '#ef4444', icon: '✕' },
    info:    { bg: '#3b82f6', icon: 'ℹ' },
  };
  const c = colors[type] || colors.success;

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      background: c.bg, color: '#fff', padding: '14px 24px',
      borderRadius: 14, fontWeight: 600, fontSize: 15,
      boxShadow: '0 8px 30px rgba(0,0,0,.2)', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'fadeIn .3s ease', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 18 }}>{c.icon}</span>
      {message}
    </div>
  );
}
