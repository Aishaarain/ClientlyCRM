import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('velora_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('velora_token');
    const storedUser  = readStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    const onLogout = () => { setUser(null); setToken(null); };
    window.addEventListener('velora:logout', onLogout);
    return () => window.removeEventListener('velora:logout', onLogout);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('velora_token', data.token);
    localStorage.setItem('velora_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login    = async (payload) => { const data = await authApi.login(payload);    persistSession(data); return data; };
  const register = async (payload) => { const data = await authApi.register(payload); persistSession(data); return data; };
  const logout   = () => {
    localStorage.removeItem('velora_token');
    localStorage.removeItem('velora_user');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    booting,
    setBooting,
    login,
    register,
    logout,
    // ✅ handy helpers used throughout the app
    isAdmin:      user?.role === 'admin',
    isFreelancer: user?.role === 'freelancer',
    workspaceId:  user?.workspaceId,
  }), [user, token, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}