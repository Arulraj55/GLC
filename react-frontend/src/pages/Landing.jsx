import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND } from '../api';

const features = [
  { icon: '🌿', title: '100% Fresh',       desc: 'Farm-fresh produce delivered directly from local farms' },
  { icon: '🤝', title: 'Fair Prices',       desc: 'No middlemen means better prices for everyone' },
  { icon: '🚚', title: 'Fast Delivery',     desc: 'Quick and reliable delivery to your doorstep' },
  { icon: '🔒', title: 'Secure Payments',  desc: 'Safe and secure transactions via UPI / COD' },
];

const roles = [
  {
    icon: '🌾', title: 'Farmer',
    desc: 'List your fresh crops, set fair prices, and sell directly to shops and customers. Grow your business!',
    btn: 'Start Selling', path: '/signin/farmer',
    img: `${BACKEND}/GLC2.jpg`,
    color: '#2e7d32',
  },
  {
    icon: '🏪', title: 'Shop Owner',
    desc: 'Source fresh produce from local farmers at great prices. Stock your shop with quality goods!',
    btn: 'Manage Shop', path: '/signin/shop',
    img: `${BACKEND}/GLC3.jpg`,
    color: '#1565c0',
  },
  {
    icon: '🛒', title: 'Customer',
    desc: 'Browse fresh products from local shops. Enjoy quality produce delivered to your doorstep!',
    btn: 'Start Shopping', path: '/signin/customer',
    img: `${BACKEND}/GLC4.jpg`,
    color: '#7c3aed',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, Segoe UI, sans-serif' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        background: `linear-gradient(135deg, rgba(27,94,32,0.97) 0%, rgba(46,125,50,0.93) 60%, rgba(56,142,60,0.90) 100%),
                     url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80) center/cover no-repeat`,
      }}>
        {/* nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff' }}>
            <div style={{
              width: 48, height: 48, background: 'rgba(255,255,255,0.18)',
              borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 26, backdropFilter: 'blur(6px)',
            }}>🌿</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.3px' }}>
              Green<span style={{ color: '#ffb300' }}> Link</span> Commerce <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 600 }}>(GLC)</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {roles.map(r => (
              <button key={r.title} onClick={() => navigate(r.path)} style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', padding: '9px 18px', borderRadius: 10, fontWeight: 600,
                fontSize: 13, cursor: 'pointer', backdropFilter: 'blur(6px)', transition: '.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >{r.icon} {r.title}</button>
            ))}
          </div>
        </header>

        {/* hero body */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px 60px', textAlign: 'center', color: '#fff',
        }}>
          <div style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.15)',
            padding: '6px 18px', borderRadius: 30, fontSize: 13, fontWeight: 600,
            letterSpacing: 1, marginBottom: 20, backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}>🌱 Farm to Table — Directly</div>

          <h2 style={{
            fontSize: 'clamp(32px, 5.5vw, 60px)', fontWeight: 900,
            marginBottom: 22, lineHeight: 1.15, letterSpacing: '-1px',
          }}>
            The Freshest Produce,<br />
            <span style={{ color: '#ffb300' }}>Direct from Farms</span>
          </h2>

          <p style={{
            fontSize: 17, maxWidth: 600, lineHeight: 1.75,
            opacity: 0.92, marginBottom: 52, color: '#e8f5e9',
          }}>
            Green Link Commerce (GLC) connects farmers, shopkeepers, and customers in one seamless
            platform — fair prices, zero middlemen, and farm-fresh quality every time.
          </p>

          {/* role cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24, maxWidth: 1020, width: '100%',
          }}>
            {roles.map(r => (
              <RoleCard key={r.title} role={r} onClick={() => navigate(r.path)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER ═══════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '40px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 20,
        }}>
          {[
            { num: '16+',   label: 'Farmers',       icon: '🌾' },
            { num: '16+',   label: 'Shops',         icon: '🏪' },
            { num: '100+',  label: 'Products',       icon: '🥬' },
            { num: '100%',  label: 'Farm Fresh',     icon: '✅' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '16px 10px' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#2e7d32', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 14, color: '#6b7280', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 20px', background: '#f8faf8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#4caf50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            WHY GREEN LINK COMMERCE
          </p>
          <h2 style={{ textAlign: 'center', fontSize: 34, fontWeight: 800, marginBottom: 56, color: '#1b5e20', letterSpacing: '-0.5px' }}>
            Built for Everyone in the Chain
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 28 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                textAlign: 'center', padding: '36px 24px', borderRadius: 20,
                background: '#fff', boxShadow: '0 4px 24px rgba(46,125,50,.07)',
                border: '1px solid #e8f5e9', transition: 'transform .3s, box-shadow .3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(46,125,50,.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 24px rgba(46,125,50,.07)'; }}
              >
                <div style={{
                  width: 72, height: 72,
                  background: `linear-gradient(135deg, ${['#e8f5e9','#e3f2fd','#fff3e0','#f3e8ff'][i]}, ${['#c8e6c9','#bbdefb','#ffe0b2','#e9d5ff'][i]})`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 22px', fontSize: 32,
                  boxShadow: `0 4px 16px ${['rgba(46,125,50,.15)','rgba(21,101,192,.12)','rgba(245,158,11,.12)','rgba(124,58,237,.12)'][i]}`,
                }}>{f.icon}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#1a2e1a' }}>{f.title}</h4>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4caf50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 52, color: '#1b5e20' }}>Simple. Fast. Fresh.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '🌾', title: 'Farmer Lists',    desc: 'Farmer registers and lists fresh produce with prices' },
              { step: '02', icon: '🏪', title: 'Shop Stocks',     desc: 'Shop owner browses and adds products to their cart' },
              { step: '03', icon: '🛒', title: 'Customer Buys',   desc: 'Customer shops, pays securely via UPI or COD' },
              { step: '04', icon: '🚚', title: 'Delivery Done',   desc: 'Order confirmed and delivered within 3–5 days' },
            ].map(s => (
              <div key={s.step} style={{ position: 'relative', padding: '30px 20px', borderRadius: 20, background: '#f8faf8', border: '1px solid #e8f5e9' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 11, fontWeight: 800, color: '#c8e6c9', letterSpacing: 1 }}>{s.step}</div>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#1b5e20' }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '70px 20px', textAlign: 'center',
        background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
        color: '#fff',
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to get started?</h2>
        <p style={{ fontSize: 16, opacity: .88, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          Join hundreds of farmers, shops, and customers on GreenLink today.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {roles.map(r => (
            <button key={r.title} onClick={() => navigate(r.path)} style={{
              padding: '14px 32px', borderRadius: 30, fontWeight: 700, fontSize: 15,
              cursor: 'pointer', transition: '.3s',
              background: r.title === 'Customer' ? '#ffb300' : 'rgba(255,255,255,0.15)',
              color: r.title === 'Customer' ? '#1b5e20' : '#fff',
              border: r.title === 'Customer' ? 'none' : '2px solid rgba(255,255,255,0.4)',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >{r.icon} {r.btn}</button>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#1a2e1a', color: '#fff', padding: '48px 20px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🌿 Green Link Commerce (GLC)</h3>
            <p style={{ opacity: .65, fontSize: 14, lineHeight: 1.6, maxWidth: 280 }}>Connecting Farmers, Shops &amp; Customers across Tamil Nadu.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, opacity: .5, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {roles.map(r => (
                <span key={r.title} onClick={() => navigate(r.path)} style={{ fontSize: 14, opacity: .75, cursor: 'pointer', transition: '.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '.75'}
                >{r.icon} {r.title} Portal</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, opacity: .5, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Facebook',  icon: 'f' },
                { label: 'Twitter',   icon: '𝕏' },
                { label: 'Instagram', icon: '◈' },
                { label: 'LinkedIn',  icon: 'in' },
              ].map(s => (
                <div key={s.label} title={s.label} style={{
                  width: 42, height: 42, background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: '.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ffb300'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >{s.icon}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '28px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: 13, opacity: .5 }}>
          © 2025 GreenLink Commerce. All Rights Reserved. Made with 💚 for Tamil Nadu farmers.
        </div>
      </footer>
    </div>
  );
}

/* ─── Role Card component ─────────────────────────────────────────────────── */
function RoleCard({ role, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 22, overflow: 'hidden',
        cursor: 'pointer', color: '#1a2e1a',
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,.3)' : '0 8px 32px rgba(0,0,0,.18)',
        transition: 'transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* image */}
      <div style={{ height: 190, position: 'relative', overflow: 'hidden' }}>
        <img
          src={role.img}
          alt={role.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform .45s ease',
          }}
          onError={e => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${role.color}33, ${role.color}66)`;
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
        {/* floating icon badge */}
        <div style={{
          position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)',
          width: 54, height: 54, background: role.color, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          boxShadow: `0 6px 20px ${role.color}55`, zIndex: 2,
          border: '3px solid #fff',
        }}>{role.icon}</div>
      </div>

      {/* body */}
      <div style={{ padding: '36px 24px 28px', textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: role.color }}>{role.title}</h3>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, marginBottom: 22 }}>{role.desc}</p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', background: role.color, color: '#fff',
          borderRadius: 28, fontWeight: 700, fontSize: 14,
          boxShadow: `0 4px 16px ${role.color}44`,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform .25s',
        }}>{role.btn} →</div>
      </div>
    </div>
  );
}
