// Backend base URL - used ONLY for static images
// All /api calls use relative paths so Vite proxy handles them (no CORS issue)
export const BACKEND = 'https://glc-1.onrender.com';

const base = (path, opts = {}) =>
  fetch(path, { credentials: 'include', ...opts });

export const api = {
  session:        () => base('/api/session').then(r => r.json()),
  login:          (d) => base('/api/login',           { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) }).then(r => r.json()),
  shopLogin:      (d) => base('/api/shop/login',      { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) }).then(r => r.json()),
  customerLogin:  (d) => base('/api/customer/login',  { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) }).then(r => r.json()),
  signup:         (d) => base('/api/signup',          { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) }).then(r => r.json()),
  shopSignup:     (d) => base('/api/shop/signup',     { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) }).then(r => r.json()),
  customerSignup: (d) => base('/api/customer/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) }).then(r => r.json()),
  logout:         () => base('/api/logout', { method:'POST' }).then(r => r.json()),

  cart: {
    get:    ()     => base('/api/cart').then(r => r.json()),
    add:    (item) => base('/api/cart', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(item) }).then(r => r.json()),
    remove: (id)   => base(`/api/cart/${id}`, { method:'DELETE' }).then(r => r.json()),
  },

  orders: {
    get:    ()      => base('/api/orders').then(r => r.json()),
    create: (order) => base('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(order) }).then(r => r.json()),
  },

  farmer: {
    products:      ()         => base('/api/farmer/products').then(r => r.json()),
    addProduct:    (formData) => base('/api/farmer/product', { method:'POST', body: formData }).then(r => r.json()),
    removeProduct: (name)     => base(`/api/farmer/product?name=${encodeURIComponent(name)}`, { method:'DELETE' }).then(r => r.json()),
  },

  shop: {
    products:      ()         => base('/api/shop/products').then(r => r.json()),
    addProduct:    (formData) => base('/api/shop/product', { method:'POST', body: formData }).then(r => r.json()),
    removeProduct: (name)     => base(`/api/shop/product?name=${encodeURIComponent(name)}`, { method:'DELETE' }).then(r => r.json()),
  },
};

/**
 * Resolve any image path to a full URL.
 * - Strips "frontend/" prefix the backend sometimes stores
 * - Prefixes BACKEND so images load from the render server
 */
export function img(path) {
  if (!path) return `${BACKEND}/product1.jpg`;
  if (path.startsWith('http')) return path;
  const clean = path.replace(/^frontend\//, '').replace(/^\//, '');
  return `${BACKEND}/${clean}`;
}
