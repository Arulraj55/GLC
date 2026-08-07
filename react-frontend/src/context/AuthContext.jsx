import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const s = await api.session();
      setUser(s.loggedIn ? s : { loggedIn: false });
    } catch {
      setUser({ loggedIn: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const logout = async () => {
    try { await api.logout(); } catch {}
    setUser({ loggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
