import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, img } from '../api';
import { useAuth } from '../context/AuthContext';
import { produceList } from '../data';
import Toast from '../components/Toast';

const PRIMARY    = '#1565c0';
const PRIMARY_LT = '#42a5f5';

export default function ShopDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (!authLoading) {
      if (!user?.loggedIn || user?.role !== 'shop') {
        navigate('/signin/shop');
      } else {
        loadProducts();
      }
    }
  }, [authLoading, user]);

  const loadProducts = async () => {
    setLoading(true);
    try { setProducts(await api.shop.products()); }
    catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = formRef.current;
    const fd = new FormData();
    fd.append('name', form.pname.value.trim());
    fd.append('price', form.price.value);
    if (form.photo.files[0]) fd.append('photo', form.photo.files[0]);
    try {
      const res = await api.shop.addProduct(fd);
      if (res.success) {
        setShowModal(false); form.reset();
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
    if (!confirm(`Remove ${name}?`)) return;
    try {
      await api.shop.removeProduct(name);
      await loadProducts();
      setToast({ msg: `${name} removed`, type: 'info' });
    } catch {
      setToast({ msg: 'Failed to remove', type: 'error' });
    }
  };

  const priced    = products.filter(p => p.price != null);
  const inStock   = products.filter(p => (p.stock||0) > 0).length;
  const avgPrice  = priced.length ? Math.round(priced.reduce((s,p) => s+(parseFloat(p.price)||0),0)/priced.length) : 0;
  const totalVal  = products.reduce((s,p) => s+(parseFloat(p.price)||0)*(p.stock||0), 0).toFixed(0);

  const metrics = [
    { label:'Total Products', value: products.length },
    { label:'In Stock',       value: inStock },
    { label:'Avg Price',      value: `₹${avgPrice}` },
    { label:'Total Value',    value: `₹${totalVal}` },
  ];

  const inputSt = { width:'100%', padding:'12px 14px', border:'2px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none', fontFamily:'inherit', transition:'.2s' };

  return (
    <div style={{ minHeight:'100vh', background:'#f5f8fc', paddingBottom:90 }}>
      <header style={{ background:`linear-gradient(135deg,${PRIMARY},${PRIMARY_LT})`, color:'#fff', padding:'22px 20px', textAlign:'center', position:'relative' }}>
        <h1 style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>🏪 Shop Dashboard</h1>
        <p style={{ opacity:.9, fontSize:14 }}>Welcome, {user?.username}!</p>
        <div style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', display:'flex', gap:10 }}>
          <button onClick={() => navigate('/shop-browse')} style={{ background:'rgba(255,255,255,.18)', border:'none', color:'#fff', padding:'8px 14px', borderRadius:10, fontWeight:600, cursor:'pointer', fontSize:12 }}>Browse</button>
          <button onClick={async () => { await logout(); navigate('/'); }} style={{ background:'rgba(255,255,255,.18)', border:'none', color:'#fff', padding:'8px 14px', borderRadius:10, fontWeight:600, cursor:'pointer', fontSize:12 }}>Logout</button>
        </div>
      </header>

      {/* Metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:12, padding:20, maxWidth:900, margin:'0 auto' }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background:'#fff', padding:16, borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,.06)', textAlign:'center' }}>
            <div style={{ fontSize:11, textTransform:'uppercase', color:'#6b7280', letterSpacing:.5, marginBottom:8 }}>{m.label}</div>
            <div style={{ fontSize:26, fontWeight:700, color:PRIMARY }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 20px' }}>
        <h2 style={{ fontSize:17, fontWeight:600, marginBottom:14 }}>My Inventory</h2>
        {loading ? (
          <p style={{ textAlign:'center', color:'#9ca3af', padding:40 }}>Loading...</p>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'50px 20px', background:'#fff', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize:50, marginBottom:16 }}>🏪</div>
            <h3 style={{ fontSize:20, marginBottom:10, color:'#6b7280' }}>No products yet</h3>
            <p style={{ color:'#9ca3af', marginBottom:20 }}>Add products to your shop inventory!</p>
            <button onClick={() => setShowModal(true)} style={{ background:PRIMARY, color:'#fff', border:'none', padding:'12px 24px', borderRadius:10, fontWeight:600, cursor:'pointer' }}>Add Product</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px,1fr))', gap:16 }}>
            {products.map(p => (
              <div key={p.name} style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,.08)', transition:'.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.08)'; }}
              >
                <div style={{ width:'100%', aspectRatio:'1', backgroundImage:`url('${img(p.image||'product1.jpg')}')`, backgroundSize:'cover', backgroundPosition:'center', backgroundColor:'#e3f2fd' }} />
                <div style={{ padding:12 }}>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{p.name}</h3>
                  <div style={{ fontSize:15, fontWeight:700, color:PRIMARY }}>{p.price != null ? `₹${p.price} per kg` : 'No price'}</div>
                  <div style={{ fontSize:12, color:'#6b7280', marginTop:3, marginBottom:10 }}>Stock: {p.stock||0} kg</div>
                  <button onClick={() => removeProduct(p.name)} style={{ width:'100%', padding:'8px', border:'none', borderRadius:8, background:'#fee2e2', color:'#dc2626', fontSize:12, fontWeight:600, cursor:'pointer', transition:'.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#dc2626'; e.currentTarget.style.color='#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.color='#dc2626'; }}
                  >Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#fff', padding:'14px 20px', display:'flex', justifyContent:'center', gap:16, boxShadow:'0 -2px 20px rgba(0,0,0,.1)' }}>
        <button onClick={() => setShowModal(true)} style={{ flex:1, maxWidth:200, padding:12, border:'none', borderRadius:10, background:PRIMARY, color:'#fff', fontWeight:600, fontSize:14, cursor:'pointer' }}>+ Add Product</button>
        <button onClick={() => navigate('/shop-browse')} style={{ flex:1, maxWidth:200, padding:12, border:'none', borderRadius:10, background:'#e3f2fd', color:PRIMARY, fontWeight:600, fontSize:14, cursor:'pointer' }}>Browse Market</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }}>
          <div style={{ background:'#fff', width:'90%', maxWidth:400, padding:26, borderRadius:20, animation:'popIn .3s ease' }}>
            <h2 style={{ fontSize:20, marginBottom:20 }}>Add Product</h2>
            <form ref={formRef} onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:6, color:'#6b7280' }}>Product Name</label>
                <input name="pname" list="spList" required placeholder="e.g. Carrot" style={inputSt}
                  onFocus={e => e.target.style.borderColor=PRIMARY} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                <datalist id="spList">{produceList.map(n => <option key={n} value={n} />)}</datalist>
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:6, color:'#6b7280' }}>Price (₹ per kg)</label>
                <input name="price" type="number" min="1" max="999" step="0.5" required placeholder="e.g. 45" style={inputSt}
                  onFocus={e => e.target.style.borderColor=PRIMARY} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:6, color:'#6b7280' }}>Photo (optional)</label>
                <input name="photo" type="file" accept="image/*" style={{ ...inputSt, padding:'10px 14px' }} />
              </div>
              <div style={{ display:'flex', gap:12, marginTop:4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex:1, padding:12, border:'none', borderRadius:10, background:'#f3f4f6', color:'#374151', fontWeight:600, cursor:'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ flex:1, padding:12, border:'none', borderRadius:10, background:PRIMARY, color:'#fff', fontWeight:600, cursor:'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Product'}
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
