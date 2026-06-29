import { useState, useRef, useEffect } from 'react';
import { Menu, Search, LogOut, Bell, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Topbar({ onOpenMobile }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when search opens on mobile
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Search destinations
  const searchLinks = [
    { label: 'Clients',      path: '/clients',      show: isAdmin },
    { label: 'Projects',     path: '/projects',     show: true },
    { label: 'Invoices',     path: '/invoices',     show: isAdmin },
    { label: 'Interactions', path: '/interactions', show: isAdmin },
    { label: 'Tasks',        path: '/tasks',        show: isAdmin },
    { label: 'AI Proposal',  path: '/ai/proposal',  show: isAdmin },
    { label: 'AI Follow-up', path: '/ai/follow-up', show: isAdmin },
    { label: 'AI Content',   path: '/ai/content',   show: isAdmin },
    { label: 'Risk Center',  path: '/risk',         show: isAdmin },
    { label: 'Team',         path: '/team',         show: isAdmin },
    { label: 'Settings',     path: '/settings',     show: true },
    { label: 'Dashboard',    path: '/dashboard',    show: true },
  ];

  const filteredLinks = searchQuery.trim().length > 0
    ? searchLinks.filter(
        (l) => l.show && l.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchNavigate = (path) => {
    navigate(path);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  return (
    <header className="sticky top-0 z-20 border-b border-white/80 bg-soft/80 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between gap-4">

        {/* ── Left: hamburger + search ── */}
        <div className="flex flex-1 items-center gap-3">

          {/* Mobile hamburger */}
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-ink shadow-card transition hover:text-primary lg:hidden"
            onClick={onOpenMobile}
          >
            <Menu size={19} />
          </button>

          {/* Desktop search */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-card">
              <Search size={16} className="shrink-0 text-muted" />
              <input
                ref={searchRef}
                className="w-56 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={14} className="text-muted hover:text-ink" />
                </button>
              )}
            </div>

            {/* Search dropdown */}
            {searchOpen && filteredLinks.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
                {filteredLinks.map((link) => (
                  <button
                    key={link.path}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink transition hover:bg-soft hover:text-primary"
                    onMouseDown={() => handleSearchNavigate(link.path)}
                  >
                    <Search size={14} className="text-muted" />
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {searchOpen && searchQuery.trim().length > 0 && filteredLinks.length === 0 && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-line bg-white px-4 py-4 shadow-xl">
                <p className="text-sm text-muted">No pages found for "<span className="font-bold text-ink">{searchQuery}</span>"</p>
              </div>
            )}
          </div>

          {/* Mobile search toggle */}
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-muted shadow-card transition hover:text-primary md:hidden"
            onClick={() => setSearchOpen((p) => !p)}
          >
            <Search size={18} />
          </button>
        </div>

        {/* ── Right: bell + user + logout ── */}
        <div className="flex items-center gap-2">

        

          {/* User info — desktop */}
          <div className="hidden items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-card sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary via-cyan to-pink text-xs font-black text-white">
              {user?.name?.[0]?.toUpperCase() || <User size={14} />}
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-ink leading-none">{user?.name || 'User'}</p>
              <p className="mt-0.5 text-xs text-muted">{user?.email || ''}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-muted shadow-card transition hover:bg-red-50 hover:text-red-500"
            title="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      {/* ── Mobile search bar (expands below topbar) ── */}
      {searchOpen && (
        <div className="relative mt-3 md:hidden">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-card">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              ref={searchRef}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={14} className="text-muted" />
              </button>
            )}
          </div>

          {filteredLinks.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
              {filteredLinks.map((link) => (
                <button
                  key={link.path}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-ink transition hover:bg-soft hover:text-primary"
                  onMouseDown={() => handleSearchNavigate(link.path)}
                >
                  <Search size={14} className="text-muted" />
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {searchQuery.trim().length > 0 && filteredLinks.length === 0 && (
            <div className="absolute left-0 top-full mt-2 w-full rounded-2xl border border-line bg-white px-4 py-4 shadow-xl">
              <p className="text-sm text-muted">No pages found for "<span className="font-bold text-ink">{searchQuery}</span>"</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
}