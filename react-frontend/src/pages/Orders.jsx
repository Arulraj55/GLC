import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, img } from '../api';
import { useAuth } from '../context/AuthContext';

const PRIMARY = '#7c3aed';
const SUCCESS = '#10b981';
const WARNING = '#f59e0b';
const INFO    = '#3b82f6';

const STATUS_CONFIG = {
  confirmed:  { label: 'Order Confirmed', icon: '✓',  color: PRIMARY, bg: '#ede9fe' },
  processing: { label: 'Processing',      icon: '⏱',  color: WARNING, bg: '#fef3c7' },
  shipped:    { label: 'Shipped',         icon: '🚚', color: INFO,    bg: '#dbeafe' },
  delivered:  { label: 'Delivered',       icon: '✓',  color: SUCCESS, bg: '#d1fae5' },
};
const STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.get()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  // Go to the correct home page based on role
  const goHome = () => {
    if (user?.role === 'shop')         navigate('/shop-browse');
    else if (user?.role === 'customer') navigate('/market');
    else if (user?.role === 'farmer')  navigate('/farmer-dashboard');
    else                               navigate('/');
  };

  const stats = { total: orders.length, processing: 0, shipped: 0, delivered: 0 };
  orders.forEach(o => {
    const s = (o.status || 'confirmed').toLowerCase();
    if (['confirmed', 'processing'].includes(s)) stats.processing++;
    else if (s === 'shipped')   stats.shipped++;
    else if (s === 'delivered') stats.delivered++;
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>⟳</div>
      <p style={{ color: '#6b7280' }}>Loading orders…</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(135deg,${PRIMARY},#6d28d9)`,
        color: '#fff', padding: '20px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(124,58,237,.3)',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          📦 My Orders
        </h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Back → goes to the user's home (market / shop-browse / farmer-dashboard) */}
          <button
            onClick={goHome}
            style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
          >← Home</button>

          {/* Cart — separate destination */}
          <button
            onClick={() => navigate('/cart')}
            style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
          >🛒 Cart</button>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '30px auto', padding: '0 20px' }}>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 20, marginBottom: 30 }}>
          {[
            { label: 'Total Orders', value: stats.total,      icon: '🧾', color: PRIMARY, bg: '#ede9fe' },
            { label: 'Processing',   value: stats.processing, icon: '⏱',  color: WARNING, bg: '#fef3c7' },
            { label: 'Shipped',      value: stats.shipped,    icon: '🚚', color: INFO,    bg: '#dbeafe' },
            { label: 'Delivered',    value: stats.delivered,  icon: '✅', color: SUCCESS, bg: '#d1fae5' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '22px 20px', boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>
              <div style={{ width: 48, height: 48, background: s.bg, color: s.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Order History ── */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          📋 Order History
        </h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 16 }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📦</div>
            <h3 style={{ fontSize: 22, marginBottom: 10 }}>No orders yet</h3>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>You haven't placed any orders yet.</p>
            <button
              onClick={goHome}
              style={{ padding: '13px 28px', background: PRIMARY, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
            >Browse Products</button>
          </div>
        ) : orders.map(order => {
          const status = (order.status || 'confirmed').toLowerCase();
          const cfg    = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;
          const curIdx = STEPS.indexOf(status);
          const date   = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });

          return (
            <div key={order._id || order.orderId} style={{ background: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,.05)' }}>

              {/* order header */}
              <div style={{
                padding: '18px 22px', background: '#faf5ff',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: 12,
              }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>🧾 {order.orderId}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>Ordered on {date}</p>
                </div>
                <span style={{ padding: '7px 15px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 13, fontWeight: 600 }}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>

              <div style={{ padding: '18px 22px' }}>

                {/* progress tracker */}
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: 18, marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 19, left: 20, right: 20, height: 3, background: '#e5e7eb', zIndex: 0 }} />
                    {STEPS.map((s, i) => {
                      const c      = STATUS_CONFIG[s];
                      const done   = i < curIdx;
                      const active = i === curIdx;
                      return (
                        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                          <div style={{
                            width: 38, height: 38, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, marginBottom: 7, transition: '.3s',
                            background: done ? SUCCESS : (active ? PRIMARY : '#e5e7eb'),
                            color: done || active ? '#fff' : '#9ca3af',
                            animation: active ? 'pulse 2s infinite' : 'none',
                          }}>
                            {done ? '✓' : c.icon}
                          </div>
                          <span style={{
                            fontSize: 10, textAlign: 'center', maxWidth: 72,
                            color: done || active ? '#1a2e1a' : '#9ca3af',
                            fontWeight: done || active ? 600 : 400,
                          }}>{c.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* items */}
                <div style={{ marginBottom: 16 }}>
                  {(order.items || []).slice(0, 3).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{
                        width: 58, height: 58, borderRadius: 10, flexShrink: 0,
                        backgroundImage: `url('${img(item.image || 'product1.jpg')}')`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        backgroundColor: '#e5e7eb',
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.product}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>From: {item.farmer || 'Market'}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>₹{parseFloat(item.price) || 0}</div>
                    </div>
                  ))}
                  {(order.items || []).length > 3 && (
                    <p style={{ fontSize: 13, color: '#6b7280', paddingTop: 8 }}>
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 14, borderTop: '1px solid #e5e7eb', flexWrap: 'wrap', gap: 10,
                }}>
                  <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
                    <strong>🚚 Estimated Delivery:</strong>{' '}
                    {order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '3–5 business days'}
                    <br />
                    {order.payment?.method === 'cod'
                      ? <span style={{ color: WARNING }}>💵 Cash on Delivery</span>
                      : <span style={{ color: SUCCESS }}>💳 Paid via UPI</span>}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Total: ₹{order.total || 0}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
