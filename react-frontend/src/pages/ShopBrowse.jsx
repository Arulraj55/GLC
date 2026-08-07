import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmers, allFarmerProducts } from '../data';
import { api, img } from '../api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Toast from '../components/Toast';

// Shop owner browsing farmers = buy.html equivalent (green theme)
const PRIMARY    = '#2e7d32';
const PRIMARY_DK = '#1b5e20';

const TABS = [
  { id: 'home',     label: 'Home',         icon: '🏠' },
  { id: 'products', label: 'All Products', icon: '🥬' },
  { id: 'farmers',  label: 'All Farmers',  icon: '👨‍🌾' },
  { id: 'search',   label: 'Search',       icon: '🔍' },
];

export default function ShopBrowse() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab]           = useState('home');
  const [query, setQuery]       = useState('');
  const [modal, setModal]       = useState(null);
  const [farmerModal, setFarmerModal] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  const addToCart = useCallback(async (product, farmerName) => {
    try {
      await api.cart.add({
        product: product.name,
        farmer:  farmerName || product.farmerName || 'Market',
        price:   product.price,
        image:   product.img || '',
      });
      showToast(`${product.name} added to cart!`);
    } catch {
      showToast('Added to cart!');
    }
  }, [showToast]);

  const searchResults = query.trim()
    ? allFarmerProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const farmerResults = query.trim()
    ? farmers.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.location.toLowerCase().includes(query.toLowerCase()))
    : [];

  /* ── Farmer Card ────────────────────────────────────────────────────────── */
  const FarmerCard = ({ f }) => (
    <div
      onClick={() => setFarmerModal(f)}
      style={{
        background: '#fff', borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,.08)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'transform .25s, box-shadow .25s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(0,0,0,.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'; }}
    >
      <div style={{
        width: '100%', aspectRatio: '4/3',
        backgroundImage: `url('${img(f.img)}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundColor: '#e8f5e9',
      }} />
      <div style={{ padding: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: PRIMARY, marginBottom: 6 }}>{f.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ color: '#ff9800', fontSize: 13 }}>
            {'★'.repeat(Math.floor(f.rating))}{'☆'.repeat(5 - Math.floor(f.rating))}
          </span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{f.rating}</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>📍 {f.location}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
          {f.products.length} products
        </div>
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>{title}</h2>
      {children}
    </div>
  );

  const Grid = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16 }}>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5', paddingBottom: 80 }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DK})`,
        color: '#fff', padding: '20px 24px',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,.15)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>🌿 GreenLink Market</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user?.loggedIn && (
              <span style={{ fontSize: 13, opacity: .85 }}>👋 {user.username}</span>
            )}
            <button onClick={() => navigate('/cart')} style={{ background: 'rgba(255,255,255,.18)', border: 'none', color: '#fff', padding: '9px 16px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              🛒 Cart
            </button>
            <button onClick={() => navigate('/shop-dashboard')} style={{ background: 'rgba(255,255,255,.18)', border: 'none', color: '#fff', padding: '9px 14px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              Dashboard
            </button>
            {user?.loggedIn && (
              <button onClick={async () => { await logout(); navigate('/'); }} style={{ background: 'rgba(255,255,255,.12)', border: 'none', color: '#fff', padding: '9px 14px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {/* HOME */}
        {tab === 'home' && (
          <>
            <Section title="🏆 Top Products">
              <Grid>
                {allFarmerProducts.slice(0, 8).map((p, i) => (
                  <ProductCard key={`${i}-${p.name}-${p.img}`} product={p} onOpen={setModal} onAddToCart={p => addToCart(p)} accentColor={PRIMARY} />
                ))}
              </Grid>
            </Section>
            <Section title="⭐ Top Farmers">
              <Grid>
                {farmers.slice(0, 8).map(f => <FarmerCard key={f.id} f={f} />)}
              </Grid>
            </Section>
          </>
        )}

        {/* ALL PRODUCTS - combined farmers + shops */}
        {tab === 'products' && (
          <Section title="🥬 All Products">
            <Grid>
              {allFarmerProducts.map((p, i) => (
                <ProductCard key={`${i}-${p.name}-${p.img}`} product={p} onOpen={setModal} onAddToCart={p => addToCart(p)} accentColor={PRIMARY} />
              ))}
            </Grid>
          </Section>
        )}

        {/* ALL FARMERS */}
        {tab === 'farmers' && (
          <Section title="👨‍🌾 All Farmers">
            <Grid>{farmers.map(f => <FarmerCard key={f.id} f={f} />)}</Grid>
          </Section>
        )}

        {/* SEARCH */}
        {tab === 'search' && (
          <div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,.06)', marginBottom: 20 }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products or farmers..."
                style={{ width: '100%', padding: '13px 18px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            {!query && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>Type to search...</p>}
            {query && !searchResults.length && !farmerResults.length && (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>No results found</p>
            )}
            {searchResults.length > 0 && (
              <Section title="Products">
                <Grid>
                  {searchResults.map((p, i) => (
                    <ProductCard key={`${i}-${p.name}-${p.img}`} product={p} onOpen={setModal} onAddToCart={p => addToCart(p)} accentColor={PRIMARY} />
                  ))}
                </Grid>
              </Section>
            )}
            {farmerResults.length > 0 && (
              <Section title="Farmers">
                <Grid>{farmerResults.map(f => <FarmerCard key={f.id} f={f} />)}</Grid>
              </Section>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', display: 'flex', boxShadow: '0 -4px 20px rgba(0,0,0,.1)', zIndex: 100 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '12px 8px', border: 'none',
            background: 'none', cursor: 'pointer',
            color: tab === t.id ? PRIMARY : '#9ca3af',
            fontSize: 11, fontWeight: 600, position: 'relative',
          }}>
            {tab === t.id && (
              <div style={{ position: 'absolute', top: 0, width: 36, height: 3, background: PRIMARY, borderRadius: '0 0 4px 4px' }} />
            )}
            <span style={{ fontSize: 22, marginBottom: 3 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Product Modal ── */}
      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onAddToCart={p => addToCart(p)}
          accentColor={PRIMARY}
          sourceLabel="Farmer"
        />
      )}

      {/* ── Farmer Products Drawer ── */}
      {farmerModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setFarmerModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 400, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div style={{
            background: '#fff', width: '100%', maxWidth: 640,
            maxHeight: '85vh', borderRadius: '24px 24px 0 0',
            overflowY: 'auto', animation: 'slideUp .3s ease',
          }}>
            <div style={{
              padding: 20, borderBottom: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'center', gap: 16,
              position: 'sticky', top: 0, background: '#fff', zIndex: 1,
            }}>
              <img
                src={img(farmerModal.img)}
                alt={farmerModal.name}
                style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', backgroundColor: '#e8f5e9' }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{farmerModal.name}</h2>
                <div style={{ color: '#ff9800', fontSize: 13 }}>
                  {'★'.repeat(Math.floor(farmerModal.rating))}
                  <span style={{ color: '#6b7280', marginLeft: 6 }}>{farmerModal.rating}</span>
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>📍 {farmerModal.location}</div>
              </div>
              <button onClick={() => setFarmerModal(null)} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px,1fr))', gap: 14 }}>
              {farmerModal.products.map(p => (
                <ProductCard
                  key={p.name + p.img}
                  product={p}
                  onOpen={setModal}
                  onAddToCart={p => addToCart(p, farmerModal.name)}
                  accentColor={PRIMARY}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
