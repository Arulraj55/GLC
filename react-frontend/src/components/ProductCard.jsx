import React from 'react';
import { img } from '../api';

export default function ProductCard({ product, onOpen, onAddToCart, accentColor = '#2e7d32' }) {
  return (
    <div
      onClick={() => onOpen(product)}
      style={{
        background: '#fff', borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,.08)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'transform .25s, box-shadow .25s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(0,0,0,.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'; }}
    >
      <div style={{
        width: '100%', aspectRatio: '4/3',
        backgroundImage: `url('${img(product.img)}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundColor: '#e8f5e9',
      }} />
      <div style={{ padding: '12px 14px 14px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{product.name}</h3>
        <div style={{ fontSize: 16, fontWeight: 800, color: accentColor }}>
          ₹{product.price}
          <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}> / kg</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onAddToCart(product); }}
          style={{
            marginTop: 10, width: '100%', padding: '9px 10px', border: 'none',
            borderRadius: 10, background: accentColor, color: '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: '.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
