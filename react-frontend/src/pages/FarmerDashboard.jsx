import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, img } from '../api';
import { useAuth } from '../context/AuthContext';
import { produceList } from '../data';
import Toast from '../components/Toast';

const PRIMARY    = '#2e7d32';
const PRIMARY_LT = '#4caf50';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();

  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [toast,      setToast]      = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (!authLoading) {
      if (!user?.loggedIn || user?.role !== 'farmer') {
        navigate('/signin/farmer');
      } else {
        loadProducts();
      }
    }
  }, [authLoading, user]);

  const loadProducts = async () => {
    setLoading(true);
    try   { setProducts(await api.farmer.products()); }
    catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = formRef.current;
    const fd   = new FormData();
    fd.append('name',  form.pname.value.trim());
    fd.append('price', form.price.value);
    if (form.photo.files[0]) fd.append('photo', form.photo.files[0]);
    try {
      const res = await api.farmer.addProduct(fd);
      if (res.success) {
        setShowModal(false);
        form.reset();
        await loadProducts();
        setToast({ msg: 'Product added!', type: 'success' });
      } else {
        setToast({ msg: res.error || 'Failed to save', type: 'error' });
      }
    } catch {
      setToast({ msg: 'Network error', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const removeProduct = async (name) => {
    if (!confirm(`Remove "${name}"?`)) return;
    try {
      await api.farmer.removeProduct(name);
      await loadProducts();
      setToast({ msg: `${name} removed`, type: 'info' });
    } catch {
      setToast({ msg: 'Failed to remove', type: 'error' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const priced   = products.filter(p => p.price != null);
  const avgPrice = priced.length
    ? Math.round(priced.reduce((s, p) => s + (parseFloat(p.price) || 0), 0) / priced.length)
    : 0;
  const lastProd = priced.length ? priced[priced.length - 1].name.slice(0, 10) : '-';

  const metrics = [
    { label: 'Total Products', value: products.length },
    { label: 'Priced Items',   value: priced.length },
    { label: 'Avg Price',      value: `₹${avgPrice}` },
    { label: 'Last Updated',   value: lastProd },
  ];

  const inputSt = {
    width: '100%', padding: '12px 14px',
    border: '2px solid #e5e7eb', borderRadius: 10,
    fontSize: 14, outline: 'none',
    fontFamily: 'inherit', transition: '.2s',
    background: '#fafafa',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8', paddingBottom: 90 }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_LT})`,
        color: '#fff', padding: '18px 24px',
        boxShadow: '0 4px 20px rgba(0,0,0,.12)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* left: title + welcome */}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>🌾 Farmer Dashboard</h1>
            <p style={{ fontSize: 13, opacity: .88 }}>Welcome, <strong>{user?.username}</strong>!</p>
          </div>

          {/* right: logout button — always visible */}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,.2)',
              border: '1px solid rgba(255,255,255,.35)',
              color: '#fff', padding: '9px 20px',
              borderRadius: 10, fontWeight: 600,
              cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: '.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.32)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.2)'}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* ── Metrics ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
        gap: 12, padding: '20px 20px 0',
        maxWidth: 900, margin: '0 auto',
      }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: '#fff', padding: 16, borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,.06)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: '#6b7280', letterSpacing: .5, marginBottom: 8 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: PRIMARY }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Products Grid ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 20px 0' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: '#1a2e1a' }}>My Products</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 50, color: '#9ca3af' }}>
            <div style={{ fontSize: 32, animation: 'spin 1s linear infinite', marginBottom: 12 }}>⟳</div>
            Loading…
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: '#fff', borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,.06)',
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🌱</div>
            <h3 style={{ fontSize: 20, marginBottom: 10, color: '#6b7280' }}>No products yet</h3>
            <p style={{ color: '#9ca3af', marginBottom: 20 }}>Start adding products to sell to shops!</p>
            <button
              onClick={() => setShowModal(true)}
              style={{ background: PRIMARY, color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
            >+ Add First Product</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px,1fr))', gap: 16 }}>
            {products.map(p => (
              <div
                key={p.name}
                style={{
                  background: '#fff', borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,.08)',
                  transition: 'transform .25s, box-shadow .25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'; }}
              >
                <div style={{
                  width: '100%', aspectRatio: '1',
                  backgroundImage: `url('${img(p.image || 'product1.jpg')}')`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  backgroundColor: '#e8f5e9',
                }} />
                <div style={{ padding: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: '#1a2e1a' }}>{p.name}</h3>
                  <div style={{ fontSize: 15, fontWeight: 700, color: PRIMARY, marginBottom: 10 }}>
                    {p.price != null ? `₹${p.price} per kg` : 'No price set'}
                  </div>
                  <button
                    onClick={() => removeProduct(p.name)}
                    style={{
                      width: '100%', padding: '8px', border: 'none',
                      borderRadius: 8, background: '#fee2e2', color: '#dc2626',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: '.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                  >🗑 Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', padding: '14px 20px',
        display: 'flex', justifyContent: 'center', gap: 16,
        boxShadow: '0 -2px 20px rgba(0,0,0,.1)',
      }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            flex: 1, maxWidth: 220, padding: 13,
            border: 'none', borderRadius: 12,
            background: PRIMARY, color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            transition: '.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >+ Add Product</button>
      </div>

      {/* ── Add Product Modal ── */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, padding: 16,
          }}
        >
          <div style={{
            background: '#fff', width: '100%', maxWidth: 420,
            padding: 28, borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,.2)',
            animation: 'popIn .3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a2e1a' }}>Add / Update Product</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}
              >×</button>
            </div>

            <form ref={formRef} onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7, color: '#374151' }}>
                  Product Name
                </label>
                <input
                  name="pname"
                  list="pList"
                  required
                  placeholder="e.g. Carrot"
                  style={inputSt}
                  onFocus={e => { e.target.style.borderColor = PRIMARY; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; }}
                />
                <datalist id="pList">
                  {produceList.map(n => <option key={n} value={n} />)}
                </datalist>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7, color: '#374151' }}>
                  Price (₹ per kg)
                </label>
                <input
                  name="price"
                  type="number"
                  min="1" max="999" step="0.5"
                  required
                  placeholder="e.g. 45"
                  style={inputSt}
                  onFocus={e => { e.target.style.borderColor = PRIMARY; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fafafa'; }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 7, color: '#374151' }}>
                  Photo (optional)
                </label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  style={{ ...inputSt, padding: '10px 14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: 13, border: 'none', borderRadius: 12, background: '#f3f4f6', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
                >Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 1, padding: 13, border: 'none', borderRadius: 12,
                    background: submitting ? '#9ca3af' : PRIMARY,
                    color: '#fff', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  {submitting ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Saving…</> : '✓ Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
