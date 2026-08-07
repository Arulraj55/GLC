import React from 'react';
import { img } from '../api';
import { getProducedDate } from '../data';

// sourceLabel: 'Farmer' for ShopBrowse, 'Shop' for Market/customer
// The modal auto-picks the right name from product fields based on sourceLabel
export default function ProductModal({ product, onClose, onAddToCart, accentColor = '#2e7d32', sourceLabel = 'Farmer' }) {
  if (!product) return null;

  // Pick the correct source name based on who is viewing
  const sourceName = sourceLabel === 'Shop'
    ? (product.shopName || product.farmerName || 'GreenLink')
    : (product.farmerName || product.shopName || 'GreenLink');

  const sourceLocation = sourceLabel === 'Shop'
    ? (product.shopLocation || product.farmerLocation || 'Tamil Nadu')
    : (product.farmerLocation || product.shopLocation || 'Tamil Nadu');

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div onClick={handleBackdrop} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 460,
        borderRadius: 22, overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,.3)',
        animation: 'popIn .3s ease',
      }}>
        {/* product image */}
        <div style={{
          width: '100%', aspectRatio: '4/3',
          backgroundImage: `url('${img(product.img)}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundColor: '#e8f5e9',
        }} />

        {/* body */}
        <div style={{ padding: 26 }}>
          <h2 style={{ fontSize: 22, marginBottom: 8, color: accentColor, fontWeight: 800 }}>
            {product.name}
          </h2>
          <div style={{ fontSize: 28, fontWeight: 800, color: accentColor, marginBottom: 18 }}>
            ₹{product.price}
            <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}> per kg</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {[
              ['Produced Date', getProducedDate()],
              ['Expiry',        product.expiry   || '5 days'],
              ['Category',      product.category || 'Fresh Produce'],
              ['Stock',         `${product.stock || 80} kg`],
              [sourceLabel,     sourceName],
              ['Origin',        sourceLocation],
            ].map(([label, value]) => (
              <div key={label} style={{ background: '#f5f7f5', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .5, color: '#9ca3af', marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2e1a' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: 13, border: 'none', borderRadius: 12,
              background: '#f3f4f6', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Close</button>
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              style={{
                flex: 1, padding: 13, border: 'none', borderRadius: 12,
                background: accentColor, color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: '.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >🛒 Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
