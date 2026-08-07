import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { shops, allShopProducts } from '../data';
import { api, img } from '../api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Toast from '../components/Toast';

const PRIMARY    = '#1565c0';
const PRIMARY_DK = '#0d47a1';

const TABS = [
  { id: 'home',     label: 'Home',         icon: '🏠' },
  { id: 'shops',    label: 'All Shops',    icon: '🏪' },
  { id: 'products', label: 'All Products', icon: '🥬' },
  { id: 'search',   label: 'Search',       icon: '🔍' },
];

export default function Market() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tab, setTab]           = useState('home');
  const [query, setQuery]       = useState('');
  const [modal, setModal]       = useState(null);   // product detail popup
  const [shopModal, setShopModal] = useState(null); // shop products drawer
  const [toast, setToast]       = useState(null);

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  const addToCart = useCallback(async (product, shopName) => {
    try {
      await api.cart.add({
        product: product.name,
        farmer:  shopName || product.shopName || 'Shop',
        price:   product.price,
        image:   product.img || '',
      });
      showToast(`${product.name} added to cart!`);
    } catch {
      showToast('Added to cart!');
    }
  }, [showToast]);

  const searchResults = query.trim()
    ? allShopProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const shopResults = query.trim()
    ? shops.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.location.toLowerCase().includes(query.toLowerCase()))
    : [];

  /* ── ShopCard (opens drawer — NOT a new page) ─────────────────────────── */
  const ShopCard = ({ s }) => (
    <div
      onClick={() => setShopModal(s)}
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
        backgroundImage: `url('${img(s.img)}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundColor: '#e3f2fd',
      }} />
      <div style={{ padding: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: PRIMARY, marginBottom: 6 }}>{s.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ color: '#ff9800', fontSize: 13 }}>
            {'★'.repeat(Math.floor(s.rating))}{'☆'.repeat(5 - Math.floor(s.rating))}
          </span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{s.rating}</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>📍 {s.location}</div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>
          {s.products.length} products
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
    <div style={{ minHeight: '100vh', background: '#f5f7fa', paddingBottom: 80 }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DK})`,
        color: '#fff', padding: '20px 24px',
        position: 'sticky', top: 0, zIndex: 50,
        boxShadow: '0 4px 20px rgba(0,0,0,.15)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>🏪 GreenLink Shop</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user?.loggedIn && <span style={{ fontSize: 13, opacity: .85 }}>👋 {user.username}</span>}
            <button onClick={() => navigate('/orders')} style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '9px 16px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              📦 Orders
            </button>
            <button onClick={() => navigate('/cart')} style={{ background: 'rgba(255,255,255,.18)', border: 'none', color: '#fff', padding: '9px 16px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
              🛒 Cart
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

        {tab === 'home' && (
          <>
            <Section title="🏆 Top Products">
              <Grid>
                {allShopProducts.slice(0, 8).map((p, i) => (
                  <ProductCard key={`${i}-${p.name}-${p.img}`} product={p} onOpen={setModal} onAddToCart={p => addToCart(p)} accentColor={PRIMARY} />
                ))}
              </Grid>
            </Section>
            <Section title="⭐ Top Shops">
              <Grid>{shops.slice(0, 8).map(s => <ShopCard key={s.id} s={s} />)}</Grid>
            </Section>
          </>
        )}

        {tab === 'shops' && (
          <Section title="🏪 All Shops">
            <Grid>{shops.map(s => <ShopCard key={s.id} s={s} />)}</Grid>
          </Section>
        )}

        {/* All Products = combined farmers + shops */}
        {tab === 'products' && (
          <Section title="🥬 All Products">
            <Grid>
              {allShopProducts.map((p, i) => (
                <ProductCard key={`${i}-${p.name}-${p.img}`} product={p} onOpen={setModal} onAddToCart={p => addToCart(p)} accentColor={PRIMARY} />
              ))}
            </Grid>
          </Section>
        )}

        {tab === 'search' && (
          <div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,.06)', marginBottom: 20 }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products or shops..."
                style={{ width: '100%', padding: '13px 18px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16, outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            {!query && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>Type to search...</p>}
            {query && !searchResults.length && !shopResults.length && (
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
            {shopResults.length > 0 && (
              <Section title="Shops">
                <Grid>{shopResults.map(s => <ShopCard key={s.id} s={s} />)}</Grid>
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
            color: tab === t.id ? PRIMARY : '#9ca3af', fontSize: 11, fontWeight: 600, position: 'relative',
          }}>
            {tab === t.id && <div style={{ position: 'absolute', top: 0, width: 36, height: 3, background: PRIMARY, borderRadius: '0 0 4px 4px' }} />}
            <span style={{ fontSize: 22, marginBottom: 3 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Shop Products Drawer (bottom sheet) ── */}
      {shopModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShopModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div style={{ background: '#fff', width: '100%', maxWidth: 700, maxHeight: '85vh', borderRadius: '24px 24px 0 0', overflowY: 'auto', animation: 'slideUp .3s ease' }}>
            {/* drawer header */}
            <div style={{ padding: 20, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <img
                src={img(shopModal.img)} alt={shopModal.name}
                style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', backgroundColor: '#e3f2fd' }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{shopModal.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#ff9800', fontSize: 13 }}>{'★'.repeat(Math.floor(shopModal.rating))}</span>
                  <span style={{ color: '#6b7280', fontSize: 13 }}>{shopModal.rating}</span>
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>📍 {shopModal.location}</div>
              </div>
              <button onClick={() => setShopModal(null)} style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
            </div>
            {/* products grid inside drawer */}
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 14 }}>
              {shopModal.products.map(p => (
                <ProductCard
                  key={p.name + p.img}
                  product={p}
                  onOpen={prod => { setModal(prod); }}
                  onAddToCart={prod => addToCart(prod, shopModal.name)}
                  accentColor={PRIMARY}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Product Detail Modal (zIndex higher than drawer) ── */}
      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onAddToCart={p => addToCart(p, p.shopName)}
          accentColor={PRIMARY}
          sourceLabel="Shop"
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
