import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, img } from '../api';

const RAZORPAY_KEY = 'rzp_test_R5aHWs3LDSo8k3';

const steps = ['Shipping Details', 'Payment', 'Confirmation'];

const PRIMARY  = '#7c3aed';
const PRIMARY_DK = '#6d28d9';
const SUCCESS  = '#10b981';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [payment, setPayment] = useState('upi');
  const [orderId, setOrderId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({ fullName:'', phone:'', address:'', city:'', state:'', pincode:'' });

  useEffect(() => {
    api.cart.get().then(setCartItems).catch(() => setCartItems([]));
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const subtotal = cartItems.reduce((s, i) => s + (parseFloat(i.price) || 0), 0);
  const tax      = Math.round(subtotal * 0.18);
  const total    = subtotal + tax;

  const validate = () => {
    if (step === 0) {
      const missing = Object.entries(form).find(([, v]) => !v.trim());
      if (missing) { alert('Please fill all shipping details'); return false; }
    }
    return true;
  };

  const next = async () => {
    if (!validate()) return;
    if (step === 2) { await placeOrder(); return; }
    setStep(s => s + 1);
  };

  const placeOrder = async () => {
    if (payment === 'upi') {
      const options = {
        key: RAZORPAY_KEY, amount: total * 100, currency: 'INR',
        name: 'GreenLink', description: 'Order Payment',
        handler: async (resp) => { await saveOrder(resp.razorpay_payment_id); },
        prefill: { name: form.fullName, contact: form.phone },
        theme: { color: PRIMARY },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      await saveOrder('COD');
    }
  };

  const saveOrder = async (paymentId) => {
    const oid = 'GLC-' + Date.now().toString(36).toUpperCase();
    const orderData = {
      orderId: oid,
      items: cartItems,
      shipping: form,
      payment: { method: payment, paymentId, status: payment === 'cod' ? 'pending' : 'paid' },
      subtotal, tax, total, status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await api.orders.create(orderData);
      if (res.success) {
        for (const item of cartItems)
          await api.cart.remove(item._id);
      }
    } catch {}
    setOrderId(oid);
    setSuccessMsg(payment === 'cod'
      ? `Pay ₹${total} on delivery. Order arrives in 3-5 business days.`
      : `Payment successful! Order arrives in 3-5 business days.`);
    setStep(3);
  };

  const inputSt = { width:'100%', padding:'13px 16px', border:'2px solid #e5e7eb', borderRadius:12, fontSize:15, outline:'none', fontFamily:'inherit', transition:'.2s' };

  return (
    <div style={{ minHeight:'100vh', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>

      <div style={{ background:'#fff', width:'100%', maxWidth:900, borderRadius:20, overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,.25)', display:'flex', flexDirection:'column', maxHeight:'90vh' }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${PRIMARY},${PRIMARY_DK})`, color:'#fff', padding:'18px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h1 style={{ fontSize:20, fontWeight:700, display:'flex', alignItems:'center', gap:10 }}>💳 Checkout</h1>
          <button onClick={() => navigate('/cart')} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'none', color:'#fff', fontSize:18, cursor:'pointer' }}>×</button>
        </div>

        {/* Progress */}
        <div style={{ background:`linear-gradient(135deg,#a78bfa,${PRIMARY})`, padding:'26px 30px' }}>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{
                    width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:700, fontSize:15, transition:'.3s',
                    background: i < step ? SUCCESS : (i === step ? '#fff' : 'rgba(255,255,255,.25)'),
                    color: i < step ? '#fff' : (i === step ? PRIMARY : 'rgba(255,255,255,.8)'),
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ marginTop:6, fontSize:11, color: i === step ? '#fff' : 'rgba(255,255,255,.7)', fontWeight:600, textAlign:'center', maxWidth:80 }}>{s}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width:70, height:3, margin:'0 8px 18px', background: i < step ? SUCCESS : 'rgba(255,255,255,.28)', borderRadius:2 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
          <div style={{ flex:1, padding:30, overflowY:'auto' }}>

            {/* Step 0 – Shipping */}
            {step === 0 && (
              <div style={{ animation:'fadeIn .3s ease' }}>
                <h2 style={{ fontSize:20, fontWeight:700, marginBottom:22, display:'flex', alignItems:'center', gap:10 }}>🚚 Shipping Information</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:18 }}>
                  {[['Full Name','fullName','text'],['Phone Number','phone','tel']].map(([label, key, type]) => (
                    <div key={key}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'#374151' }}>{label}</label>
                      <input type={type} value={form[key]} onChange={set(key)} placeholder={label} style={inputSt}
                        onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'#374151' }}>Address</label>
                  <input type="text" value={form.address} onChange={set('address')} placeholder="Full address" style={inputSt}
                    onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:18 }}>
                  {[['City','city'],['State','state']].map(([label, key]) => (
                    <div key={key}>
                      <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'#374151' }}>{label}</label>
                      <input type="text" value={form[key]} onChange={set(key)} placeholder={label} style={inputSt}
                        onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                  ))}
                </div>
                <div style={{ maxWidth:180 }}>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'#374151' }}>Pincode</label>
                  <input type="text" value={form.pincode} onChange={set('pincode')} placeholder="Pincode" style={inputSt}
                    onFocus={e => e.target.style.borderColor = PRIMARY} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>
            )}

            {/* Step 1 – Payment */}
            {step === 1 && (
              <div style={{ animation:'fadeIn .3s ease' }}>
                <h2 style={{ fontSize:20, fontWeight:700, marginBottom:22, display:'flex', alignItems:'center', gap:10 }}>💳 Payment</h2>
                {[
                  { id:'upi', label:'UPI / Razorpay', icon:'📱' },
                  { id:'cod', label:'Cash on Delivery', icon:'💵' },
                ].map(opt => (
                  <label key={opt.id} onClick={() => setPayment(opt.id)} style={{
                    display:'flex', alignItems:'center', gap:16, padding:'16px 20px', marginBottom:14,
                    border:`2px solid ${payment === opt.id ? PRIMARY : '#e5e7eb'}`,
                    borderRadius:12, cursor:'pointer',
                    background: payment === opt.id ? '#f5f3ff' : '#fff',
                    transition:'.2s',
                  }}>
                    <input type="radio" checked={payment === opt.id} onChange={() => setPayment(opt.id)} style={{ width:18, height:18, accentColor:PRIMARY }} />
                    <div style={{ width:50, height:34, background:'#f3f4f6', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{opt.icon}</div>
                    <span style={{ fontWeight:600, fontSize:15 }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Step 2 – Review */}
            {step === 2 && (
              <div style={{ animation:'fadeIn .3s ease' }}>
                <h2 style={{ fontSize:20, fontWeight:700, marginBottom:22 }}>✅ Review Your Order</h2>
                {[
                  { title:'Shipping Address', content: `${form.fullName}\n${form.address}\n${form.city}, ${form.state} – ${form.pincode}\n📞 ${form.phone}` },
                  { title:'Payment Method', content: payment === 'upi' ? '📱 UPI / Razorpay' : '💵 Cash on Delivery' },
                ].map(s => (
                  <div key={s.title} style={{ background:'#f9fafb', borderRadius:12, padding:20, marginBottom:16 }}>
                    <h4 style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>{s.title}</h4>
                    <p style={{ fontSize:14, color:'#6b7280', whiteSpace:'pre-line', lineHeight:1.7 }}>{s.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3 – Success */}
            {step === 3 && (
              <div style={{ textAlign:'center', padding:'50px 20px', animation:'fadeIn .3s ease' }}>
                <div style={{ width:90, height:90, background:SUCCESS, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', fontSize:44, color:'#fff', animation:'successPop .5s ease' }}>✓</div>
                <h2 style={{ fontSize:26, marginBottom:12 }}>Order Placed Successfully!</h2>
                <p style={{ fontSize:15, color:'#6b7280', marginBottom:20 }}>{successMsg}</p>
                <div style={{ background:'#f3f4f6', padding:'12px 24px', borderRadius:10, fontFamily:'monospace', fontSize:16, marginBottom:28, display:'inline-block' }}>{orderId}</div>
                <br />
                <button onClick={() => navigate('/orders')} style={{ padding:'14px 28px', background:PRIMARY, color:'#fff', border:'none', borderRadius:12, fontWeight:600, fontSize:15, cursor:'pointer' }}>
                  📦 Track My Orders
                </button>
              </div>
            )}
          </div>

          {/* Sidebar – Order Summary */}
          {step < 3 && (
            <div style={{ width:300, background:'#faf5ff', padding:28, borderLeft:'1px solid #e5e7eb', overflowY:'auto' }}>
              <h3 style={{ fontSize:17, fontWeight:700, marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>🧾 Order Summary</h3>
              {cartItems.length === 0 && <p style={{ color:'#9ca3af', textAlign:'center', padding:20 }}>Cart is empty</p>}
              {cartItems.map(item => (
                <div key={item._id} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid #e5e7eb' }}>
                <div style={{ width:54, height:54, borderRadius:10, backgroundImage:`url('${img(item.image)}')`, backgroundSize:'cover', backgroundPosition:'center', backgroundColor:'#e5e7eb' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{item.product}</div>
                    <div style={{ fontSize:12, color:'#6b7280' }}>From: {item.farmer || 'Market'}</div>
                  </div>
                  <div style={{ fontWeight:700, fontSize:13 }}>₹{parseFloat(item.price)||0}</div>
                </div>
              ))}
              <div style={{ marginTop:18, paddingTop:14, borderTop:'2px solid #e5e7eb' }}>
                {[['Subtotal', `₹${subtotal}`],['Shipping','FREE'],['Tax (18% GST)',`₹${tax}`]].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13 }}>
                    <span>{l}</span><span>{v}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, paddingTop:12, borderTop:'1px solid #e5e7eb', fontSize:17, fontWeight:800 }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div style={{ padding:'18px 28px', borderTop:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', background:'#fff' }}>
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} style={{ padding:'13px 26px', background:'#f3f4f6', border:'none', borderRadius:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>← Previous</button>
              : <div />
            }
            <button onClick={next} style={{
              padding:'13px 26px', border:'none', borderRadius:12, fontWeight:600, fontSize:15, cursor:'pointer',
              background: step === 2 ? SUCCESS : PRIMARY, color:'#fff',
              display:'flex', alignItems:'center', gap:8,
            }}>
              {step === 2 ? '🛍️ Place Order' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
