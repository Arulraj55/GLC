import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, img } from '../api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState(null);

  const isShop     = user?.role === 'shop';
  const primary    = isShop ? '#1565c0' : '#2e7d32';
  const primaryDk  = isShop ? '#0d47a1' : '#1b5e20';

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.cart.get()); }
    catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    await api.cart.remove(id);
    setToast({ msg: 'Item removed', type: 'info' });
    load();
  };

  const total = items.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
  const avg   = items.length ? (total / items.length).toFixed(0) : 0;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:40, animation:'spin 1s linear infinite' }}>⟳</div>
      <p style={{ color:'#6b7280' }}>Loading your cart...</p>
    </div>
  );

  const backPath = isShop ? '/shop-browse' : (user?.role === 'customer' ? '/market' : '/');

  return (
    <div style={{ minHeight:'100vh', background:'#f5f7fa', paddingBottom:100 }}>
      {/* Header */}
      <header style={{ background:`linear-gradient(135deg,${primary},${primaryDk})`, color:'#fff', padding:'20px 24px', position:'sticky', top:0, zIndex:50, boxShadow:'0 4px 20px rgba(0,0,0,.15)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={() => navigate(backPath)} style={{ width:44, height:44, background:'rgba(255,255,255,.15)', border:'none', borderRadius:12, color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, display:'flex', alignItems:'center', gap:10 }}>🛒 My Cart</h1>
              <p style={{ fontSize:13, opacity:.85, marginTop:2 }}>{user?.loggedIn ? `${user.username}'s Cart` : 'Please sign in'}</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => navigate('/orders')} style={{ background:'rgba(255,255,255,.15)', border:'none', color:'#fff', padding:'9px 16px', borderRadius:10, fontWeight:600, cursor:'pointer', fontSize:13 }}>📦 My Orders</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 20px' }}>
        {items.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:20, marginBottom:28 }}>
            {[
              { icon:'📦', label:'Items in Cart', value:items.length, color:'#3b82f6', bg:'#eff6ff' },
              { icon:'💰', label:'Total Amount',  value:`₹${total.toFixed(0)}`, color:'#2e7d32', bg:'#f0fdf4' },
              { icon:'🏷️', label:'Avg per Item',  value:`₹${avg}`, color:'#f57c00', bg:'#fff7ed' },
            ].map(s => (
              <div key={s.label} style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:60, height:60, background:s.bg, color:s.color, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:26, fontWeight:700, color:'#1a2e1a' }}>{s.value}</div>
                  <div style={{ fontSize:13, color:'#6b7280', marginTop:3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background:'#fff', borderRadius:24, boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize:60, marginBottom:20 }}>🛒</div>
            <h2 style={{ fontSize:24, fontWeight:700, marginBottom:12 }}>Your Cart is Empty</h2>
            <p style={{ color:'#6b7280', marginBottom:30 }}>Looks like you haven't added any products yet!</p>
            <button onClick={() => navigate(backPath)} style={{ padding:'14px 32px', background:primary, color:'#fff', border:'none', borderRadius:30, fontWeight:600, fontSize:16, cursor:'pointer' }}>
              🛍️ Start Shopping
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>📦 Your Items</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:24 }}>
              {items.map(item => (
                <div key={item._id} style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,.08)', transition:'.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.08)'; }}
                >
                  <div style={{ height:160, backgroundImage:`url('${img(item.image)}')`, backgroundSize:'cover', backgroundPosition:'center', backgroundColor:'#e8f5e9', position:'relative' }}>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 50%)' }} />
                    <div style={{ position:'absolute', bottom:12, right:12, background:'#ff9800', color:'#fff', padding:'7px 15px', borderRadius:20, fontWeight:700, fontSize:15 }}>₹{parseFloat(item.price) || 0}</div>
                  </div>
                  <div style={{ padding:20 }}>
                    <h3 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>{item.product}</h3>
                    <p style={{ fontSize:14, color:'#6b7280', marginBottom:16 }}>🏪 From: {item.farmer || 'Market'}</p>
                    <button onClick={() => remove(item._id)} style={{
                      width:'100%', padding:12, border:'none', borderRadius:12,
                      background:'#fee2e2', color:'#dc2626', fontWeight:600, fontSize:14, cursor:'pointer', transition:'.3s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background='#dc2626'; e.currentTarget.style.color='#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.color='#dc2626'; }}
                    >🗑️ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Checkout bar */}
      {items.length > 0 && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', padding:'20px 30px', boxShadow:'0 -4px 30px rgba(0,0,0,.1)', display:'flex', justifyContent:'center', zIndex:100 }}>
          <div style={{ maxWidth:1200, width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:13, color:'#6b7280', marginBottom:3 }}>Total Amount</div>
              <div style={{ fontSize:28, fontWeight:800, color:primary }}>₹{total.toFixed(0)}</div>
            </div>
            <button onClick={() => navigate('/checkout')} style={{
              padding:'16px 40px', background:primary, color:'#fff', border:'none',
              borderRadius:30, fontSize:16, fontWeight:700, cursor:'pointer', transition:'.3s',
              display:'flex', alignItems:'center', gap:10,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.background=primaryDk; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';    e.currentTarget.style.background=primary; }}
            >🔒 Proceed to Checkout</button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
