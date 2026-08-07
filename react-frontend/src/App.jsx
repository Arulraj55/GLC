import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing         from './pages/Landing';
import Auth            from './pages/Auth';
import Market          from './pages/Market';       // customer  → shops (index1.html)
import ShopBrowse      from './pages/ShopBrowse';   // shop owner → farmers (buy.html)
import Cart            from './pages/Cart';
import Checkout        from './pages/Checkout';
import Orders          from './pages/Orders';
import FarmerDashboard from './pages/FarmerDashboard';
import ShopDashboard   from './pages/ShopDashboard';

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 22, color: '#2e7d32' }}>
      🌿 Loading…
    </div>
  );
  if (!user?.loggedIn) return <Navigate to={`/signin/${role}`} replace />;
  if (role && user.role !== role) return <Navigate to={`/signin/${role}`} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  const LandingOrRedirect = () => {
    if (user?.loggedIn) {
      if (user.role === 'farmer')   return <Navigate to="/farmer-dashboard" replace />;
      if (user.role === 'shop')     return <Navigate to="/shop-browse"      replace />;
      if (user.role === 'customer') return <Navigate to="/market"           replace />;
    }
    return <Landing />;
  };

  return (
    <Routes>
      <Route path="/"                 element={<LandingOrRedirect />} />
      <Route path="/signin/:role"     element={<Auth />} />

      {/* Customer: shops browsing (index1.html) */}
      <Route path="/market"           element={<Market />} />

      {/* Shop owner: farmers browsing (buy.html) */}
      <Route path="/shop-browse"      element={<ShopBrowse />} />

      {/* Shared pages */}
      <Route path="/cart"             element={<Cart />} />
      <Route path="/checkout"         element={<Checkout />} />
      <Route path="/orders"           element={<Orders />} />

      {/* Protected dashboards */}
      <Route path="/farmer-dashboard" element={
        <Protected role="farmer"><FarmerDashboard /></Protected>
      } />
      <Route path="/shop-dashboard"   element={
        <Protected role="shop"><ShopDashboard /></Protected>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
