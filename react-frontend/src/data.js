// ── helpers ──────────────────────────────────────────────────────────────────
const clamp = (v = 20) => {
  if (Number.isNaN(v)) return 40;
  return Math.min(150, Math.max(20, Math.round(v)));
};
const fromUsd = (usd = 1.5) => clamp(usd * 40 + (Math.random() * 10 - 5));
const rStock  = () => Math.floor(Math.random() * 60) + 80;

const makeBase   = (bp) => ({ name:bp.name, img:bp.img, category:bp.category, expiry:bp.expiry, price:clamp(bp.price), stock:bp.stock??rStock() });
const makeFolder = (p)  => ({ name:p.name,  img:p.img,  category:p.category,  expiry:p.expiry,  price:p.price?clamp(p.price):fromUsd(p.priceUsd), stock:p.stock??rStock() });

// Names to completely exclude from all product listings
const EXCLUDED_NAMES = new Set([
  'bitter guard', 'bitterguards', 'bitter guards',
]);
const isExcluded = (name) => EXCLUDED_NAMES.has((name || '').toLowerCase().trim());

// ── 16 base products ─────────────────────────────────────────────────────────
export const baseProducts = [
  { id:1,  name:'Carrot',       img:'product1.jpg',  category:'Root Vegetable', expiry:'7 days',  price:36 },
  { id:2,  name:'Tomato',       img:'product2.jpg',  category:'Vegetable',      expiry:'5 days',  price:44 },
  { id:3,  name:'Potato',       img:'product3.jpg',  category:'Root Vegetable', expiry:'14 days', price:32 },
  { id:4,  name:'Corn',         img:'product4.jpg',  category:'Grain',          expiry:'10 days', price:52 },
  { id:5,  name:'Cucumber',     img:'product5.jpg',  category:'Vegetable',      expiry:'5 days',  price:40 },
  { id:6,  name:'Onion',        img:'product6.jpg',  category:'Vegetable',      expiry:'21 days', price:30 },
  { id:7,  name:'Garlic',       img:'product7.jpg',  category:'Spice',          expiry:'30 days', price:90 },
  { id:8,  name:'Lettuce',      img:'product8.jpg',  category:'Leafy Green',    expiry:'4 days',  price:48 },
  { id:9,  name:'Bell Pepper',  img:'product9.jpg',  category:'Vegetable',      expiry:'7 days',  price:70 },
  { id:10, name:'Broccoli',     img:'product10.jpg', category:'Vegetable',      expiry:'5 days',  price:82 },
  { id:11, name:'Eggplant',     img:'product11.jpg', category:'Vegetable',      expiry:'7 days',  price:64 },
  { id:12, name:'Green Pepper', img:'product12.jpg', category:'Vegetable',      expiry:'7 days',  price:60 },
  { id:13, name:'Spinach',      img:'product13.jpg', category:'Leafy Green',    expiry:'3 days',  price:58 },
  { id:14, name:'Beetroot',     img:'product14.jpg', category:'Root Vegetable', expiry:'14 days', price:72 },
  { id:15, name:'Coriander',    img:'product15.jpg', category:'Herb',           expiry:'5 days',  price:55 },
  { id:16, name:'Cabbage',      img:'product16.jpg', category:'Vegetable',      expiry:'10 days', price:45 },
];

// ── folder products (used by farmers 1-10 AND shops 1-10) ────────────────────
const folderData = {
  1: [
    { name:'Tomatoes',         img:'images/farmer1/product1.jpg', category:'Vegetable',      expiry:'5 days',  priceUsd:2.0 },
    { name:'Potatoes',         img:'images/farmer1/product2.jpg', category:'Root Vegetable', expiry:'12 days', priceUsd:1.5 },
    { name:'Greens',           img:'images/farmer1/product3.jpg', category:'Leafy Green',    expiry:'4 days',  priceUsd:1.8 },
    { name:'Coriander Leaves', img:'images/farmer1/product4.jpg', category:'Herb',           expiry:'4 days',  priceUsd:3.0 },
    { name:'Brinjal',          img:'images/farmer1/product5.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:2.5 },
    { name:'Carrot',           img:'images/farmer1/product6.jpg', category:'Root Vegetable', expiry:'10 days', priceUsd:1.2 },
  ],
  2: [
    { name:"Lady's Finger",    img:'images/farmer2/product1.jpg', category:'Vegetable',      expiry:'5 days',  priceUsd:1.0 },
    { name:'Ginger',           img:'images/farmer2/product2.jpg', category:'Spice',          expiry:'15 days', priceUsd:2.5 },
    { name:'Corn',             img:'images/farmer2/product3.jpg', category:'Grain',          expiry:'12 days', priceUsd:3.0 },
    { name:'Tomatoes',         img:'images/farmer2/product4.jpg', category:'Vegetable',      expiry:'5 days',  priceUsd:1.7 },
    { name:'Cabbage',          img:'images/farmer2/product5.jpg', category:'Vegetable',      expiry:'7 days',  priceUsd:2.3 },
    { name:'Mushroom',         img:'images/farmer2/product6.jpg', category:'Fungi',          expiry:'4 days',  priceUsd:1.5 },
  ],
  3: [
    // Bitter Guard / Bitterguards excluded — slot replaced by Green Chilies remaining
    { name:'Green Chilies',    img:'images/farmer3/product2.jpg', category:'Spice',          expiry:'7 days',  priceUsd:6.0 },
    { name:'Onions',           img:'images/farmer3/product3.jpg', category:'Vegetable',      expiry:'14 days', priceUsd:7.0 },
    { name:'Bananas',          img:'images/farmer3/product4.jpg', category:'Fruit',          expiry:'5 days',  priceUsd:5.0 },
    { name:'Lemons',           img:'images/farmer3/product5.jpg', category:'Fruit',          expiry:'10 days', priceUsd:6.0 },
    { name:'Water Melons',     img:'images/farmer3/product6.jpg', category:'Fruit',          expiry:'7 days',  priceUsd:8.0 },
  ],
  4: [
    { name:'Raddish',          img:'images/farmer4/product1.jpg', category:'Root Vegetable', expiry:'7 days',  priceUsd:1.5 },
    { name:'Beetroot',         img:'images/farmer4/product2.jpg', category:'Root Vegetable', expiry:'10 days', priceUsd:2.0 },
    { name:'Pumpkin',          img:'images/farmer4/product3.jpg', category:'Vegetable',      expiry:'12 days', priceUsd:2.5 },
    { name:'Drum Stick',       img:'images/farmer4/product4.jpg', category:'Vegetable',      expiry:'8 days',  priceUsd:3.0 },
    { name:'Scarlet Gourds',   img:'images/farmer4/product5.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:3.5 },
    { name:'Wheat',            img:'images/farmer4/product6.jpg', category:'Grain',          expiry:'20 days', priceUsd:4.0 },
  ],
  5: [
    { name:'Carrots',          img:'images/farmer5/product1.jpg', category:'Root Vegetable', expiry:'10 days', priceUsd:5.0 },
    { name:'Potatoes',         img:'images/farmer5/product2.jpg', category:'Root Vegetable', expiry:'12 days', priceUsd:6.0 },
    { name:'Peas',             img:'images/farmer5/product3.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:7.0 },
    { name:'Watermelons',      img:'images/farmer5/product4.jpg', category:'Fruit',          expiry:'7 days',  priceUsd:3.5 },
    { name:'Cabbage',          img:'images/farmer5/product5.jpg', category:'Vegetable',      expiry:'7 days',  priceUsd:4.2 },
    { name:'Mushroom',         img:'images/farmer5/product6.jpg', category:'Fungi',          expiry:'4 days',  priceUsd:5.5 },
  ],
  6: [
    { name:'Cauli Flower',     img:'images/farmer6/product1.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:8.0 },
    { name:'Coriander Leaves', img:'images/farmer6/product2.jpg', category:'Herb',           expiry:'5 days',  priceUsd:9.0 },
    { name:'Corn',             img:'images/farmer6/product3.jpg', category:'Grain',          expiry:'12 days', priceUsd:10.0 },
    { name:'Beetroot',         img:'images/farmer6/product4.jpg', category:'Root Vegetable', expiry:'10 days', priceUsd:11.0 },
    { name:'Tomatoes',         img:'images/farmer6/product5.jpg', category:'Vegetable',      expiry:'5 days',  priceUsd:4.0 },
    { name:'Garlic',           img:'images/farmer6/product6.jpg', category:'Spice',          expiry:'20 days', priceUsd:12.0 },
  ],
  7: [
    { name:'Greens',           img:'images/farmer7/product1.jpg', category:'Leafy Green',    expiry:'4 days',  priceUsd:3.0 },
    { name:'Bananas',          img:'images/farmer7/product2.jpg', category:'Fruit',          expiry:'5 days',  priceUsd:3.5 },
    { name:'Pumpkin',          img:'images/farmer7/product3.jpg', category:'Vegetable',      expiry:'10 days', priceUsd:6.0 },
    { name:'Peas',             img:'images/farmer7/product4.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:5.0 },
    { name:'Wheat',            img:'images/farmer7/product5.jpg', category:'Grain',          expiry:'30 days', priceUsd:4.0 },
    { name:'Sweet Potato',     img:'images/farmer7/product6.jpg', category:'Root Vegetable', expiry:'12 days', priceUsd:2.5 },
  ],
  8: [
    // Bitter Guard excluded — remaining products kept
    { name:'Ginger',           img:'images/farmer8/product1.jpg', category:'Spice',          expiry:'18 days', priceUsd:3.0 },
    { name:'Bananas',          img:'images/farmer8/product2.jpg', category:'Fruit',          expiry:'5 days',  priceUsd:2.8 },
    { name:'Potatoes',         img:'images/farmer8/product4.jpg', category:'Root Vegetable', expiry:'12 days', priceUsd:2.5 },
    { name:'Scarlet Gourds',   img:'images/farmer8/product5.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:4.0 },
    { name:'Onions',           img:'images/farmer8/product6.jpg', category:'Vegetable',      expiry:'14 days', priceUsd:3.8 },
  ],
  9: [
    { name:'Cauli Flowers',    img:'images/farmer9/product1.jpg', category:'Vegetable',      expiry:'6 days',  priceUsd:2.0 },
    { name:'Lemons',           img:'images/farmer9/product2.jpg', category:'Fruit',          expiry:'8 days',  priceUsd:1.5 },
    { name:'Raddish',          img:'images/farmer9/product3.jpg', category:'Root Vegetable', expiry:'7 days',  priceUsd:1.8 },
    { name:"Lady's Finger",    img:'images/farmer9/product4.jpg', category:'Vegetable',      expiry:'5 days',  priceUsd:3.0 },
    { name:'Garlic',           img:'images/farmer9/product5.jpg', category:'Spice',          expiry:'20 days', priceUsd:2.5 },
    { name:'Beetroot',         img:'images/farmer9/product6.jpg', category:'Root Vegetable', expiry:'10 days', priceUsd:1.2 },
  ],
  10: [
    { name:'Brinjal',          img:'images/farmer10/product1.jpg', category:'Vegetable',     expiry:'6 days',  priceUsd:3.5 },
    { name:'Corn',             img:'images/farmer10/product2.jpg', category:'Grain',         expiry:'12 days', priceUsd:2.7 },
    { name:'Cabbage',          img:'images/farmer10/product3.jpg', category:'Vegetable',     expiry:'7 days',  priceUsd:1.9 },
    { name:'Onions',           img:'images/farmer10/product4.jpg', category:'Vegetable',     expiry:'14 days', priceUsd:2.2 },
    { name:'Green Chilies',    img:'images/farmer10/product5.jpg', category:'Spice',         expiry:'6 days',  priceUsd:2.0 },
    { name:'Drum Sticks',      img:'images/farmer10/product6.jpg', category:'Vegetable',     expiry:'8 days',  priceUsd:2.4 },
  ],
};

function pickExtra(startIdx, count, taken) {
  const result = [];
  for (let i = 0; i < baseProducts.length * 4 && result.length < count; i++) {
    const bp = baseProducts[(startIdx + i) % baseProducts.length];
    if (!taken.has(bp.name.toLowerCase()) && !isExcluded(bp.name)) {
      taken.add(bp.name.toLowerCase());
      result.push(makeBase(bp));
    }
  }
  return result;
}

// ── farmers ──────────────────────────────────────────────────────────────────
const farmerDefs = [
  { id:1,  name:'John',         gender:'M', rating:4.9, location:'Thoothukudi',     folder:1 },
  { id:2,  name:'Smith',        gender:'M', rating:4.9, location:'Tirunelveli',     folder:2 },
  { id:3,  name:'Charlie',      gender:'M', rating:4.8, location:'Trichy',          folder:3 },
  { id:4,  name:'Periyasami',   gender:'M', rating:4.8, location:'Salem',           folder:4 },
  { id:5,  name:'Chinnasami',   gender:'M', rating:4.7, location:'Karur',           folder:5 },
  { id:6,  name:'Naveen',       gender:'M', rating:4.7, location:'Chennai',         folder:6 },
  { id:7,  name:'Maajida',      gender:'F', rating:4.6, location:'Theni',           folder:7 },
  { id:8,  name:'Muthusami',    gender:'M', rating:4.6, location:'Dharmapuri',      folder:8 },
  { id:9,  name:'Meenakshi',    gender:'F', rating:4.5, location:'Madurai',         folder:9 },
  { id:10, name:'Parvathy',     gender:'F', rating:4.5, location:'Coimbatore',      folder:10 },
  { id:11, name:'Rakesh',       gender:'M', rating:4.3, location:'Erode',           image:'farmer1.jpg', baseIds:[1,2,3,4] },
  { id:12, name:'Kavitha',      gender:'F', rating:4.3, location:'Villupuram',      image:'farmer2.jpg', baseIds:[5,6,7,8] },
  { id:13, name:'Harish Kumar', gender:'M', rating:4.2, location:'Kanchipuram',     image:'farmer3.jpg', baseIds:[9,10,11,12] },
  { id:14, name:'Sneha',        gender:'F', rating:4.1, location:'Ariyalur',        image:'farmer4.jpg', baseIds:[13,14,15,16] },
  { id:15, name:'Sanjay Patel', gender:'M', rating:4.0, location:'Thiruvannamalai', image:'farmer5.jpg' },
  { id:16, name:'Divya',        gender:'F', rating:3.9, location:'Puducherry',      image:'farmer6.jpg' },
];

export const farmers = farmerDefs.map((fd, idx) => {
  const folderItems = fd.folder
    ? (folderData[fd.folder] || []).map(makeFolder).filter(p => !isExcluded(p.name))
    : [];
  const baseItems = (fd.baseIds || [])
    .map(id => { const bp = baseProducts.find(b => b.id === id); return bp ? makeBase(bp) : null; })
    .filter(p => p && !isExcluded(p.name));
  const soFar    = [...folderItems, ...baseItems];
  const taken    = new Set(soFar.map(p => p.name.toLowerCase()));
  const extra    = pickExtra(idx * 5, Math.max(0, (fd.folder ? 12 : 8) - soFar.length), taken);
  const products = [...soFar, ...extra].map(p => ({ ...p, farmerName: fd.name, farmerLocation: fd.location }));
  return { ...fd, img: fd.folder ? `images/farmer${fd.folder}/farmer.jpg` : fd.image, products };
}).sort((a, b) => b.rating - a.rating);

// ── shops ─────────────────────────────────────────────────────────────────────
const shopDefs = [
  { id:1,  name:'Fresh Mart',    rating:4.9, location:'Thoothukudi',     folder:1,  image:'shop1.jpg' },
  { id:2,  name:'Green Basket',  rating:4.9, location:'Tirunelveli',     folder:2,  image:'shop2.jpg' },
  { id:3,  name:'Organic World', rating:4.8, location:'Trichy',          folder:3,  image:'shop3.jpg' },
  { id:4,  name:'Farm Fresh',    rating:4.8, location:'Salem',           folder:4,  image:'shop4.jpg' },
  { id:5,  name:'Veggie Hub',    rating:4.7, location:'Karur',           folder:5,  image:'shop5.jpg' },
  { id:6,  name:'Nature Store',  rating:4.7, location:'Chennai',         folder:6,  image:'shop6.jpg' },
  { id:7,  name:'Healthy Picks', rating:4.6, location:'Theni',           folder:7,  image:'shop7.jpg' },
  { id:8,  name:'Daily Greens',  rating:4.6, location:'Dharmapuri',      folder:8,  image:'shop8.jpg' },
  { id:9,  name:'Super Veggies', rating:4.5, location:'Madurai',         folder:9,  image:'shop9.jpg' },
  { id:10, name:'City Market',   rating:4.5, location:'Coimbatore',      folder:10, image:'shop10.jpg' },
  { id:11, name:'Value Mart',    rating:4.3, location:'Erode',           image:'shop11.jpg',  baseIds:[1,2,3,4,5,6,7,8] },
  { id:12, name:'Quick Shop',    rating:4.3, location:'Villupuram',      image:'shop12.jpg',  baseIds:[5,6,7,8,9,10,11,12] },
  { id:13, name:'Corner Store',  rating:4.2, location:'Kanchipuram',     image:'shop13.jpeg', baseIds:[9,10,11,12,13,14,15,16] },
  { id:14, name:'Local Bazaar',  rating:4.1, location:'Ariyalur',        image:'shop14.jpg',  baseIds:[1,3,5,7,9,11,13,15] },
  { id:15, name:'Family Mart',   rating:4.0, location:'Thiruvannamalai', image:'shop15.jpg',  baseIds:[2,4,6,8,10,12,14,16] },
  { id:16, name:'Sunrise Store', rating:3.9, location:'Puducherry',      image:'shop16.png',  baseIds:[1,2,5,6,9,10,13,14] },
];

export const shops = shopDefs.map((sd, idx) => {
  const folderItems = sd.folder
    ? (folderData[sd.folder] || []).map(makeFolder).filter(p => !isExcluded(p.name))
    : [];
  const baseItems = (sd.baseIds || [])
    .map(id => { const bp = baseProducts.find(b => b.id === id); return bp ? makeBase(bp) : null; })
    .filter(p => p && !isExcluded(p.name));
  const soFar    = [...folderItems, ...baseItems];
  const taken    = new Set(soFar.map(p => p.name.toLowerCase()));
  const extra    = pickExtra(idx * 5, Math.max(0, (sd.folder ? 12 : 8) - soFar.length), taken);
  const products = [...soFar, ...extra].map(p => ({ ...p, shopName: sd.name, shopLocation: sd.location }));
  return { ...sd, img: sd.image, products };
}).sort((a, b) => b.rating - a.rating);

// ── For SHOP OWNERS (ShopBrowse) — unique by image, farmer products only ─────
// Shows farmerName in modal
const farmerImgMap = new Map();
farmers.forEach(f => f.products.forEach(p => {
  if (p.img && !farmerImgMap.has(p.img) && !isExcluded(p.name))
    farmerImgMap.set(p.img, { ...p }); // already has farmerName, farmerLocation
}));
export const allFarmerProducts = Array.from(farmerImgMap.values()).sort((a, b) => a.price - b.price);

// ── For CUSTOMERS (Market) — unique by image, shop products only ──────────────
// Shows shopName in modal
const shopImgMap = new Map();
shops.forEach(s => s.products.forEach(p => {
  if (p.img && !shopImgMap.has(p.img) && !isExcluded(p.name))
    shopImgMap.set(p.img, { ...p }); // already has shopName, shopLocation
}));
export const allShopProducts = Array.from(shopImgMap.values()).sort((a, b) => a.price - b.price);

// ── Legacy aliases (used elsewhere, keep for compatibility) ──────────────────
export const allProducts         = allFarmerProducts;
export const allCombinedProducts = allFarmerProducts; // ShopBrowse home/all tabs use farmer products

// ── utils ─────────────────────────────────────────────────────────────────────
export const getProducedDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 3));
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const produceList = [
  'Carrot','Tomato','Potato','Corn','Cucumber','Onion','Garlic','Lettuce',
  'Bell Pepper','Broccoli','Eggplant','Green Pepper','Spinach','Beetroot','Coriander','Cabbage',
];
