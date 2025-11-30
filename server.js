const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGO_URI ='mongodb+srv://arul:UzcKLWbnE03BXf9U@glc-o.nbsvw32.mongodb.net/';
const DB_NAME ='green_link';

let db;

// Static produce list with image mapping
const produceNames = [
  'Carrot','Tomato','Potato','Corn','Cucumber','Onion','Garlic','Lettuce',
  'Bell Pepper','Broccoli','Eggplant','Green Pepper','Spinach','Beetroot','Coriander','Cabbage'
];

// Helper: map produce index to default image path
function defaultProduceImage(idx) {
  return `frontend/product${idx + 1}.jpg`;
}

MongoClient.connect(MONGO_URI)
  .then((client) => {
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Helper to ensure DB is ready
function ensureDb(res) {
  if (!db) {
    res.status(503).json({ error: 'Database not connected. Please retry shortly.' });
    return false;
  }
  return true;
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'glc-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'frontend')));
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'frontend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Multer storage for product photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeBase = (file.originalname || 'image').replace(/[^a-z0-9]+/gi,'-').replace(/^-+/,'').replace(/-+$/,'').slice(0,40) || 'product';
    cb(null, safeBase + '-' + Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits:{ fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter:(req,file,cb)=>{
    if(!/^(image)\//.test(file.mimetype)) return cb(new Error('Only image uploads allowed'));
    cb(null,true);
  }
});

// Central error handler for upload + JSON response
app.use((err, req, res, next) => {
  if (err) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: err.message || 'Upload error' });
  }
  next();
});

// Helper: require login
function requireLogin(req, res, next) {
  if (!req.session) return res.status(401).json({ error: 'Not authenticated' });
  const anyUser = req.session.username || req.session.shopUsername || req.session.customerUsername;
  if (!anyUser) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// Signup (farmer) - mirrors signup.php
app.post('/api/signup', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { username, email, password, phone, city } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const farmers = db.collection('farmers');

    const existingUser = await farmers.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // New farmers start with empty products (like shop owners)
    // They will add their own products through the dashboard
    await farmers.insertOne({
      username,
      email,
      password,
      phone,
      city,
      products: [],
    });

    req.session.username = username;
    return res.json({ success: true, redirect: '/farmer_dashboard.html' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login (farmer) - improved diagnostics
app.post('/api/login', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    const farmers = db.collection('farmers');
    const user = await farmers.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    // Clear other user types from session to ensure clean cart separation
    delete req.session.shopUsername;
    delete req.session.customerUsername;
    req.session.username = user.username;
    
    console.log(`[FARMER LOGIN] Success: farmer:${username}`);
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }
      return res.json({ success: true, redirect: '/farmer_dashboard.html' });
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug: list farmers (temporary)
app.get('/api/debug/farmers', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const farmers = db.collection('farmers');
    const list = await farmers.find({}, { projection: { username: 1, email: 1, password: 1 } }).toArray();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Get farmer products (requires login)
app.get('/api/farmer/products', requireLogin, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const farmers = db.collection('farmers');
    const farmer = await farmers.findOne({ username: req.session.username });
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    let products = farmer.products || [];
    let changed = false;
    // Normalize legacy placeholder names & undefined prices/images
    products.forEach((p, idx) => {
      if (p && /^Product\s+\d+$/i.test(p.name)) {
        p.name = produceNames[idx] || p.name;
        changed = true;
      }
      if (!p.image) {
        p.image = `frontend/product${idx + 1}.jpg`;
        changed = true;
      }
      if (p.price === undefined || p.price === null) {
        const base = Math.random() * (95 - 20) + 20; // cap under 100
        p.price = Math.round(base * 2) / 2; // realistic price step
        changed = true;
      }
    });
    if (changed) {
      await farmers.updateOne({ _id: farmer._id }, { $set: { products } });
    }
    res.json(products);
  } catch (e) {
    console.error('Fetch farmer products error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get shop products (requires login)
app.get('/api/shop/products', requireLogin, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const shops = db.collection('shops');
    const username = req.session.shopUsername || req.session.username; // prefer explicit shop session
    const shop = await shops.findOne({ username });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    let products = shop.products || [];
    let changed = false;
    // Normalize names/images/prices
    products.forEach((p, idx) => {
      if (p && /^Product\s+\d+$/i.test(p.name)) {
        p.name = produceNames[idx] || p.name;
        changed = true;
      }
      if (!p.image) {
        p.image = `frontend/product${(idx % 16) + 1}.jpg`;
        changed = true;
      }
      if (p.price === undefined || p.price === null) {
        const base = Math.random() * (95 - 20) + 20; // cap under 100
        p.price = Math.round(base * 2) / 2;
        changed = true;
      }
      if (p.stock === undefined) {
        p.stock = Math.floor(Math.random() * 50) + 10;
        changed = true;
      }
    });
    if (changed) {
      await shops.updateOne({ _id: shop._id }, { $set: { products } });
    }
    // Return array for frontend simplicity
    res.json(products);
  } catch (e) {
    console.error('Fetch shop products error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add or update a shop product
app.post('/api/shop/product', requireLogin, upload.single('photo'), async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { name, price, stock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Missing name or price' });
    }
    const numericPrice = parseFloat(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    const numericStock = parseInt(stock) || 0;
    let image;
    if (req.file) {
      image = `uploads/${req.file.filename}`;
    } else {
      const imageIdx = produceNames.findIndex(p => p.toLowerCase() === String(name).toLowerCase());
      image = imageIdx >= 0 ? `frontend/product${imageIdx + 1}.jpg` : 'frontend/default.jpg';
    }
    const shops = db.collection('shops');
    const username = req.session.shopUsername || req.session.username;
    const shop = await shops.findOne({ username });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    let products = shop.products || [];
    const existingIdx = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingIdx >= 0) {
      products[existingIdx].price = numericPrice;
      products[existingIdx].stock = numericStock;
      if (image) products[existingIdx].image = image;
    } else {
      products.push({ name, price: numericPrice, stock: numericStock, image });
    }
    await shops.updateOne({ _id: shop._id }, { $set: { products } });
    res.json({ success: true, products });
  } catch (e) {
    console.error('Add/update shop product error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a shop product
app.delete('/api/shop/product', requireLogin, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Missing product name' });
    const shops = db.collection('shops');
    const username = req.session.shopUsername || req.session.username;
    const shop = await shops.findOne({ username });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    let products = shop.products || [];
    products = products.filter(p => p.name.toLowerCase() !== name.toLowerCase());
    await shops.updateOne({ _id: shop._id }, { $set: { products } });
    res.json({ success: true, products });
  } catch (e) {
    console.error('Delete shop product error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add or update a farmer product
app.post('/api/farmer/product', requireLogin, upload.single('photo'), async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const isMultipart = req.is('multipart/form-data');
    const { name, price } = isMultipart ? req.body : req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Missing name or price' });
    }
    const numericPrice = parseFloat(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    let image;
    if (req.file) {
      image = `uploads/${req.file.filename}`; // served via /uploads static
    } else {
      const imageIdx = produceNames.findIndex(p => p.toLowerCase() === String(name).toLowerCase());
      image = imageIdx >= 0 ? `frontend/product${imageIdx + 1}.jpg` : 'frontend/default.jpg';
    }
    const farmers = db.collection('farmers');
    const farmer = await farmers.findOne({ username: req.session.username });
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    let products = farmer.products || [];
    const existingIdx = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingIdx >= 0) {
      products[existingIdx].price = numericPrice;
      if (image) products[existingIdx].image = image;
    } else {
      products.push({ name, price: numericPrice, image });
    }
    await farmers.updateOne({ _id: farmer._id }, { $set: { products } });
    res.json({ success: true, products });
  } catch (e) {
    console.error('Add/update farmer product error:', e);
    const msg = e.message && e.message.includes('image') ? e.message : 'Internal server error';
    res.status(500).json({ error: msg });
  }
});

// Delete a farmer product
app.delete('/api/farmer/product', requireLogin, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Missing product name' });
    const farmers = db.collection('farmers');
    const farmer = await farmers.findOne({ username: req.session.username });
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    const before = (farmer.products||[]).length;
    const products = (farmer.products||[]).filter(p => p.name.toLowerCase() !== name.toLowerCase());
    if (products.length === before) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await farmers.updateOne({ _id: farmer._id }, { $set: { products } });
    res.json({ success: true, products });
  } catch (e) {
    console.error('Delete farmer product error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset a farmer product image back to default
app.post('/api/farmer/product/reset-image', requireLogin, async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing product name' });
    const farmers = db.collection('farmers');
    const farmer = await farmers.findOne({ username: req.session.username });
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    const idx = (farmer.products||[]).findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (idx < 0) return res.status(404).json({ error: 'Product not found' });
    const produceIdx = produceNames.findIndex(p => p.toLowerCase() === name.toLowerCase());
    let image = produceIdx >= 0 ? `frontend/product${produceIdx + 1}.jpg` : 'frontend/default.svg';
    if (image.startsWith('frontend/') && !fs.existsSync(path.join(__dirname, image))) {
      image = produceIdx === 0 ? 'frontend/carrot-placeholder.svg' : 'frontend/default.svg';
    }
    farmer.products[idx].image = image;
    await farmers.updateOne({ _id: farmer._id }, { $set: { products: farmer.products } });
    res.json({ success: true, products: farmer.products });
  } catch (e) {
    console.error('Reset product image error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shop signup - replaces shop_signup.php
app.post('/api/shop/signup', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { username, email, password, phone, city } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const shops = db.collection('shops');
    const existingShop = await shops.findOne({ username });
    if (existingShop) {
      return res.status(409).json({ error: 'Shop username already exists' });
    }

    await shops.insertOne({
      username,
      email,
      password,
      phone,
      city,
      createdAt: new Date()
    });

    console.log('[SHOP SIGNUP] created user:', username);

    req.session.shopUsername = username;
    return res.json({ success: true, redirect: '/login1.html' });
  } catch (err) {
    console.error('Shop signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Shop login - replaces shop_login.php
app.post('/api/shop/login', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const shops = db.collection('shops');
    const shop = await shops.findOne({ username });
    if (!shop) {
      console.log('[SHOP LOGIN] user not found:', username);
      return res.status(401).json({ error: 'Shop user not found' });
    }
    if (shop.password !== password) {
      console.log('[SHOP LOGIN] incorrect password for', username);
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Clear other user types from session to ensure clean cart separation
    delete req.session.customerUsername;
    delete req.session.username; // farmer username
    req.session.shopUsername = username;
    
    console.log(`[SHOP LOGIN] Success: shop:${username}`);
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }
      return res.json({ success: true, redirect: '/login1.html' });
    });
  } catch (err) {
    console.error('Shop login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug: list shops (temporary)
app.get('/api/debug/shops', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const shops = db.collection('shops');
    const list = await shops.find({}, { projection: { username: 1, email: 1, createdAt: 1 } }).toArray();
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

// TEMP: single shop debug (includes password) - remove later
app.get('/api/debug/shop/:username', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const shops = db.collection('shops');
    const doc = await shops.findOne({ username: req.params.username });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ username: doc.username, email: doc.email, password: doc.password, createdAt: doc.createdAt });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch shop' });
  }
});

// Customer signup - replaces signup2.php
app.post('/api/customer/signup', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { username, email, password, phone, city } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const customers = db.collection('customers');
    const existing = await customers.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Customer username already exists' });
    }

    await customers.insertOne({
      username,
      email,
      password,
      phone,
      city,
    });

    req.session.customerUsername = username;
    return res.json({ success: true, redirect: '/index1.html' });
  } catch (err) {
    console.error('Customer signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer login - replaces signin2.php
app.post('/api/customer/login', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const customers = db.collection('customers');
    const customer = await customers.findOne({ username, password });

    if (!customer) {
      return res.status(401).json({ error: 'Invalid customer credentials' });
    }

    // Clear other user types from session to ensure clean cart separation
    delete req.session.shopUsername;
    delete req.session.username; // farmer username
    req.session.customerUsername = username;
    
    console.log(`[CUSTOMER LOGIN] Success: customer:${username}`);
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }
      return res.json({ success: true, redirect: '/index1.html' });
    });
  } catch (err) {
    console.error('Customer login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to cart - mirrors add_to_cart.php
app.post('/api/cart', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { product, farmer, price, image: providedImage } = req.body;
    if (!product || !farmer) {
      return res.status(400).json({ success: false, error: 'Missing product or farmer' });
    }

    // Determine user type and username from session
    let userType = 'guest';
    let username = 'guest';
    
    if (req.session.shopUsername) {
      userType = 'shop';
      username = req.session.shopUsername;
    } else if (req.session.customerUsername) {
      userType = 'customer';
      username = req.session.customerUsername;
    } else if (req.session.username) {
      userType = 'farmer';
      username = req.session.username;
    }

    // Extended product image mapping with variations
    const productImageMapping = {
      'Carrot': 'product1.jpg',
      'Carrots': 'product1.jpg',
      'Tomato': 'product2.jpg',
      'Tomatoes': 'product2.jpg',
      'Potato': 'product3.jpg',
      'Potatoes': 'product3.jpg',
      'Corn': 'product4.jpg',
      'Cucumber': 'product5.jpg',
      'Onion': 'product6.jpg',
      'Onions': 'product6.jpg',
      'Garlic': 'product7.jpg',
      'Lettuce': 'product8.jpg',
      'Bell Pepper': 'product9.jpg',
      'Broccoli': 'product10.jpg',
      'Eggplant': 'product11.jpg',
      'Brinjal': 'product11.jpg',
      'Green Pepper': 'product12.jpg',
      'Green Chilies': 'product12.jpg',
      'Spinach': 'product13.jpg',
      'Greens': 'product13.jpg',
      'Beetroot': 'product14.jpg',
      'Coriander': 'product15.jpg',
      'Coriander Leaves': 'product15.jpg',
      'Cabbage': 'product16.jpg',
      'Ginger': 'product7.jpg',
      'Mushroom': 'product10.jpg',
      'Bitterguards': 'product11.jpg',
      'Bitter Guard': 'product11.jpg',
      'Bananas': 'product4.jpg',
      'Lemons': 'product5.jpg',
      'Water Melons': 'product4.jpg',
      'Watermelons': 'product4.jpg',
      'Raddish': 'product1.jpg',
      'Pumpkin': 'product16.jpg',
      'Drum Stick': 'product5.jpg',
      'Drum Sticks': 'product5.jpg',
      'Scarlet Gourds': 'product11.jpg',
      'Wheat': 'product4.jpg',
      'Peas': 'product5.jpg',
      'Sweet Potato': 'product3.jpg',
      'Cauli Flower': 'product10.jpg',
      'Cauli Flowers': 'product10.jpg',
      "Lady's Finger": 'product5.jpg',
    };

    // Use provided image if available, otherwise map from product name
    let image = providedImage;
    if (!image || image === 'default.jpg') {
      image = productImageMapping[product] || 'product1.jpg';
    }
    // Remove 'frontend/' prefix if present (normalize image path)
    if (image && image.startsWith('frontend/')) {
      image = image.replace('frontend/', '');
    }

    const cart = db.collection('cart');

    await cart.insertOne({
      product,
      farmer,
      image,
      price,
      userType,
      username,
      timestamp: new Date(),
    });

    console.log(`[CART] Added ${product} for ${userType}:${username}, image: ${image}`);
    return res.json({ success: true });
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get cart items - mirrors get_cart.php (filtered by user)
app.get('/api/cart', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    // Determine user type and username from session
    let userType = 'guest';
    let username = 'guest';
    
    if (req.session.shopUsername) {
      userType = 'shop';
      username = req.session.shopUsername;
    } else if (req.session.customerUsername) {
      userType = 'customer';
      username = req.session.customerUsername;
    } else if (req.session.username) {
      userType = 'farmer';
      username = req.session.username;
    }

    console.log(`[CART GET] Fetching cart for ${userType}:${username}`);

    const cart = db.collection('cart');
    // Only return items for this specific user AND userType (so shop:jerry is different from customer:jerry)
    const items = await cart.find({ userType, username }).sort({ timestamp: -1 }).toArray();
    
    // Normalize image paths - remove 'frontend/' prefix if present
    const normalizedItems = items.map(item => ({
      ...item,
      image: item.image ? item.image.replace('frontend/', '') : 'product1.jpg'
    }));
    
    console.log(`[CART GET] Found ${normalizedItems.length} items for ${userType}:${username}`);
    return res.json(normalizedItems);
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from cart - mirrors remove_from_cart.php
app.delete('/api/cart/:id', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { ObjectId } = require('mongodb');
    const { id } = req.params;

    const cart = db.collection('cart');
    await cart.deleteOne({ _id: new ObjectId(id) });

    return res.json({ success: true });
  } catch (err) {
    console.error('Remove from cart error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Simple session check (replaces check_session.php)
// Priority: shop > customer > farmer (to match cart API)
app.get('/api/session', (req, res) => {
  if (!req.session) return res.json({ loggedIn: false });
  
  let role = null;
  let username = null;
  
  // Check in same order as cart API for consistency
  if (req.session.shopUsername) {
    role = 'shop';
    username = req.session.shopUsername;
  } else if (req.session.customerUsername) {
    role = 'customer';
    username = req.session.customerUsername;
  } else if (req.session.username) {
    role = 'farmer';
    username = req.session.username;
  }
  
  if (role && username) {
    console.log(`[SESSION] User logged in: ${role}:${username}`);
    return res.json({ loggedIn: true, role, username });
  }
  return res.json({ loggedIn: false });
});

// Logout endpoint - clears all session data
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
});

// Debug endpoint to see session state
app.get('/api/debug/session', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    shopUsername: req.session.shopUsername || null,
    customerUsername: req.session.customerUsername || null,
    farmerUsername: req.session.username || null
  });
});

// ============ ORDERS API ============

// Create a new order
app.post('/api/orders', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    // Determine user type and username from session
    let userType = 'guest';
    let username = 'guest';
    
    if (req.session.shopUsername) {
      userType = 'shop';
      username = req.session.shopUsername;
    } else if (req.session.customerUsername) {
      userType = 'customer';
      username = req.session.customerUsername;
    } else if (req.session.username) {
      userType = 'farmer';
      username = req.session.username;
    }

    const orderData = req.body;
    
    // Add user info to order
    orderData.userType = userType;
    orderData.username = username;
    orderData.createdAt = new Date();
    orderData.updatedAt = new Date();
    
    // Set initial status based on payment method
    if (!orderData.status) {
      orderData.status = 'confirmed';
    }
    
    // Set estimated delivery (3-5 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
    orderData.estimatedDelivery = deliveryDate;

    const orders = db.collection('orders');
    await orders.insertOne(orderData);

    console.log(`[ORDER] Created order ${orderData.orderId} for ${userType}:${username}`);
    return res.json({ success: true, orderId: orderData.orderId });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders for current user
app.get('/api/orders', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    // Determine user type and username from session
    let userType = 'guest';
    let username = 'guest';
    
    if (req.session.shopUsername) {
      userType = 'shop';
      username = req.session.shopUsername;
    } else if (req.session.customerUsername) {
      userType = 'customer';
      username = req.session.customerUsername;
    } else if (req.session.username) {
      userType = 'farmer';
      username = req.session.username;
    }

    console.log(`[ORDERS GET] Fetching orders for ${userType}:${username}`);

    const orders = db.collection('orders');
    const userOrders = await orders.find({ userType, username }).sort({ createdAt: -1 }).toArray();
    
    console.log(`[ORDERS GET] Found ${userOrders.length} orders for ${userType}:${username}`);
    return res.json(userOrders);
  } catch (err) {
    console.error('Get orders error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order by orderId
app.get('/api/orders/:orderId', async (req, res) => {
  if (!ensureDb(res)) return;
  try {
    const { orderId } = req.params;
    
    // Determine user type and username from session
    let userType = 'guest';
    let username = 'guest';
    
    if (req.session.shopUsername) {
      userType = 'shop';
      username = req.session.shopUsername;
    } else if (req.session.customerUsername) {
      userType = 'customer';
      username = req.session.customerUsername;
    } else if (req.session.username) {
      userType = 'farmer';
      username = req.session.username;
    }

    const orders = db.collection('orders');
    const order = await orders.findOne({ orderId, userType, username });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    return res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve index.html for root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
