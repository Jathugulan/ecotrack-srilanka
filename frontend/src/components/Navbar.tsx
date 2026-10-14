import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  Settings,
  HelpCircle,
  Globe,
  Bell,
  ArrowRight,
  Languages,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage, Language } from '../context/LanguageContext.js';

/* ─── Theme hook ──────────────────────────────────────────────────── */
function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('ecotrack_theme') === 'dark' ||
      document.documentElement.classList.contains('dark')
    );
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ecotrack_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ecotrack_theme', 'light');
    }
  }, [dark]);

  return [dark, setDark] as const;
}

/* ─── Language Selector ───────────────────────────────────────────── */
const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const options: { code: Language; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'si', label: 'සිංහල', short: 'සිං' },
    { code: 'ta', label: 'தமிழ்', short: 'த' },
  ];

  if (compact) {
    return (
      <div className="flex items-center bg-[#F0F5F2] dark:bg-[#1B2922] rounded-lg p-0.5 border border-[#DFE8E2] dark:border-[#293B31] gap-0.5">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            aria-label={`Switch to ${opt.label}`}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all duration-150 ${
              language === opt.code
                ? 'bg-white dark:bg-[#293B31] text-[#138A5B] dark:text-[#43D99A] shadow-sm'
                : 'text-[#46574F] dark:text-[#C1CEC5] hover:text-[#172B23] dark:hover:text-[#F1F7F3]'
            }`}
          >
            {opt.short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLanguage(opt.code)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            language === opt.code
              ? 'bg-[#EAF5EE] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A] font-semibold'
              : 'text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27]'
          }`}
        >
          <span className="w-7 text-center text-[11px] font-bold">{opt.short}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

/* ─── Theme Toggle ────────────────────────────────────────────────── */
const ThemeToggle: React.FC<{ dark: boolean; toggle: () => void }> = ({ dark, toggle }) => (
  <button
    onClick={toggle}
    aria-label={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-all duration-150"
  >
    {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
  </button>
);

/* ─── Logo ────────────────────────────────────────────────────────── */
const EcoTrackLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';
  return (
    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
      <div className={`${iconSize} rounded-xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] flex items-center justify-center shadow-md shadow-[#138A5B]/20 group-hover:scale-105 transition-transform duration-200`}>
        <Leaf className="w-4.5 h-4.5 text-[#B8F34A]" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${textSize} font-bold tracking-tight text-[#172B23] dark:text-[#F1F7F3]`}>
          EcoTrack
        </span>
        <span className="text-[10px] text-[#46574F] dark:text-[#8FA196] font-medium">Sri Lanka</span>
      </div>
    </Link>
  );
};

/* ─── Public Navbar ───────────────────────────────────────────────── */
const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/waste-segregation', label: 'Waste Solutions' },
  { to: '/recycling-locator', label: 'Recycling Centers' },
];

const PublicNavbar: React.FC<{ dark: boolean; toggleDark: () => void }> = ({ dark, toggleDark }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#101916]/95 backdrop-blur-md border-b border-[#DFE8E2] dark:border-[#293B31] shadow-sm shadow-[#138A5B]/5'
          : 'bg-white dark:bg-[#101916] border-b border-[#DFE8E2] dark:border-[#293B31]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18" style={{ height: '72px' }}>

          {/* Logo */}
          <EcoTrackLogo />

          {/* Center Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            {publicLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E4F4EA] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A] font-semibold'
                      : 'text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] hover:text-[#172B23] dark:hover:text-[#F1F7F3]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions — desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSelector compact />
            <ThemeToggle dark={dark} toggle={toggleDark} />
            <div className="w-px h-5 bg-[#DFE8E2] dark:bg-[#293B31] mx-1" />
            <Link
              to="/login"
              className="px-4 py-2 text-[13px] font-semibold text-[#138A5B] dark:text-[#43D99A] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] rounded-lg transition-colors"
            >
              {t('signIn')}
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#138A5B] hover:bg-[#0E734A] rounded-xl shadow-md shadow-[#138A5B]/25 transition-all duration-150 hover:scale-[1.02]"
            >
              {t('register')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile right */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle dark={dark} toggle={toggleDark} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[#46574F] dark:text-[#C1CEC5] transition-colors"
            >
              {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div ref={mobileRef} className="lg:hidden border-t border-[#DFE8E2] dark:border-[#293B31] bg-white dark:bg-[#101916]">
          <div className="px-6 py-4 space-y-1">
            {publicLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center h-11 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E4F4EA] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A] font-semibold'
                      : 'text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="px-6 pb-5 space-y-3">
            <div className="pt-3 border-t border-[#DFE8E2] dark:border-[#293B31]">
              <p className="text-[11px] font-bold text-[#46574F] dark:text-[#8FA196] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" /> Language
              </p>
              <LanguageSelector />
            </div>

            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 h-11 flex items-center justify-center text-sm font-semibold border-2 border-[#138A5B] dark:border-[#43D99A] text-[#138A5B] dark:text-[#43D99A] rounded-xl transition-colors hover:bg-[#EAF5EE] dark:hover:bg-[#202F27]"
              >
                {t('signIn')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 h-11 flex items-center justify-center text-sm font-semibold bg-[#138A5B] hover:bg-[#0E734A] text-white rounded-xl transition-colors shadow-md shadow-[#138A5B]/25"
              >
                {t('register')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/* ─── Dashboard Topbar ────────────────────────────────────────────── */
const DashboardTopbar: React.FC<{ dark: boolean; toggleDark: () => void }> = ({ dark, toggleDark }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Outside click handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setProfileOpen(false); setLangOpen(false); setMobileOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'RESIDENT': return '/resident/dashboard';
      case 'MUNICIPAL_OFFICER': return '/municipal/dashboard';
      case 'COLLECTION_WORKER': case 'DRIVER': return '/worker/dashboard';
      case 'RECYCLING_PARTNER': return '/partner/dashboard';
      case 'SYSTEM_ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'SYSTEM_ADMIN': return 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300';
      case 'MUNICIPAL_OFFICER': return 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300';
      case 'COLLECTION_WORKER': return 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300';
      case 'DRIVER': return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300';
      case 'RECYCLING_PARTNER': return 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300';
      default: return 'bg-[#E4F4EA] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A]';
    }
  };

  const formatRole = (role: string) =>
    role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#101916] border-b border-[#DFE8E2] dark:border-[#293B31] shadow-sm shadow-black/5 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>

          {/* Left: Logo + breadcrumb */}
          <div className="flex items-center gap-4">
            <EcoTrackLogo size="sm" />
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-[#DFE8E2] dark:bg-[#293B31]" />
            {/* Dashboard breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-[13px]">
              <Link to={getDashboardPath()} className="text-[#46574F] dark:text-[#C1CEC5] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors font-medium">
                {formatRole(user.role)}
              </Link>
              <span className="text-[#DFE8E2] dark:text-[#293B31]">/</span>
              <span className="text-[#172B23] dark:text-[#F1F7F3] font-semibold capitalize">
                {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Notifications placeholder */}
            <button aria-label="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-all">
              <Bell className="w-4 h-4" />
            </button>

            {/* Language dropdown */}
            <div ref={langRef} className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Language selector"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-all"
              >
                <Globe className="w-4 h-4" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] rounded-xl shadow-xl shadow-black/10 py-2 px-2">
                  <p className="text-[10px] font-bold text-[#46574F] dark:text-[#8FA196] uppercase tracking-wider px-2 mb-1.5">Language</p>
                  <LanguageSelector />
                </div>
              )}
            </div>

            <ThemeToggle dark={dark} toggle={toggleDark} />

            {/* Profile dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="User profile"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left leading-none">
                  <p className="text-[12px] font-semibold text-[#172B23] dark:text-[#F1F7F3]">
                    {user.fullName.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-[#46574F] dark:text-[#8FA196] mt-0.5">{formatRole(user.role)}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#46574F] dark:text-[#8FA196] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] rounded-2xl shadow-2xl shadow-black/15 py-2 z-50 overflow-hidden">
                  {/* User header */}
                  <div className="px-4 py-3 border-b border-[#DFE8E2] dark:border-[#293B31]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#172B23] dark:text-[#F1F7F3] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#46574F] dark:text-[#8FA196] truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeColor()}`}>
                      {formatRole(user.role)}
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5 px-2">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#172B23] dark:text-[#F1F7F3] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
                      Dashboard
                    </Link>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#172B23] dark:text-[#F1F7F3] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-colors">
                      <UserIcon className="w-4 h-4 text-[#46574F] dark:text-[#8FA196]" />
                      My Profile
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#172B23] dark:text-[#F1F7F3] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-colors">
                      <Settings className="w-4 h-4 text-[#46574F] dark:text-[#8FA196]" />
                      Account Settings
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#172B23] dark:text-[#F1F7F3] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-colors">
                      <HelpCircle className="w-4 h-4 text-[#46574F] dark:text-[#8FA196]" />
                      Help & Support
                    </button>
                  </div>

                  <div className="border-t border-[#DFE8E2] dark:border-[#293B31] py-1.5 px-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[#46574F] dark:text-[#C1CEC5]"
            >
              {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer for dashboard */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[#DFE8E2] dark:border-[#293B31] bg-white dark:bg-[#101916] px-4 py-4">
          <div className="mb-3 pb-3 border-b border-[#DFE8E2] dark:border-[#293B31]">
            <p className="text-xs font-bold text-[#172B23] dark:text-[#F1F7F3]">{user.fullName}</p>
            <p className="text-[11px] text-[#46574F] dark:text-[#8FA196]">{user.email}</p>
          </div>
          <Link to={getDashboardPath()} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm text-[#172B23] dark:text-[#F1F7F3]">
            <LayoutDashboard className="w-4 h-4 text-[#138A5B]" /> Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 py-2 text-sm text-red-600 dark:text-red-400"
          >
            <LogOut className="w-4 h-4" /> {t('signOut')}
          </button>
        </div>
      )}
    </header>
  );
};

/* ─── Exported Navbar ─────────────────────────────────────────────── */
export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [dark, setDark] = useDarkMode();
  const toggle = useCallback(() => setDark((prev) => !prev), [setDark]);

  if (user) return <DashboardTopbar dark={dark} toggleDark={toggle} />;
  return <PublicNavbar dark={dark} toggleDark={toggle} />;
};

