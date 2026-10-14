import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Sparkles,
  Truck,
  Gift,
  ArrowRight,
  Recycle,
  BarChart3,
  Users,
  CheckCircle2,
  Building2,
  Leaf,
  Activity,
  ShieldCheck,
  Globe,
  Smartphone,
  Star,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useAuth } from '../context/AuthContext.js';

/* ─── Floating leaf decorations ─────────────────────────────────── */
const FloatingLeaf: React.FC<{ style?: React.CSSProperties; className?: string }> = ({ style, className }) => (
  <div
    className={`absolute pointer-events-none select-none opacity-20 dark:opacity-10 animate-pulse ${className || ''}`}
    style={{ fontSize: '2rem', ...style }}
    aria-hidden="true"
  >
    🌿
  </div>
);

/* ─── Stat card ──────────────────────────────────────────────────── */
interface StatCardProps { value: string; label: string; icon: React.ReactNode; }
const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => (
  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 dark:bg-[#141E19]/80 border border-[#DFE8E2] dark:border-[#293B31] backdrop-blur-sm shadow-sm">
    <div className="w-9 h-9 rounded-xl bg-[#E4F4EA] dark:bg-[#1B382B] flex items-center justify-center text-[#138A5B] dark:text-[#43D99A] shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-lg font-extrabold leading-none text-[#172B23] dark:text-[#F1F7F3]">{value}</p>
      <p className="text-[11px] text-[#46574F] dark:text-[#8FA196] font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Feature highlight ──────────────────────────────────────────── */
interface FeatureItemProps { icon: React.ReactNode; title: string; desc: string; }
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3 group">
    <div className="w-9 h-9 rounded-xl bg-[#E4F4EA] dark:bg-[#1B382B] flex items-center justify-center text-[#138A5B] dark:text-[#43D99A] shrink-0 group-hover:bg-[#138A5B] group-hover:text-white dark:group-hover:bg-[#138A5B] transition-colors duration-200 mt-0.5">
      {icon}
    </div>
    <div>
      <h3 className="text-[13.5px] font-semibold text-[#172B23] dark:text-[#F1F7F3]">{title}</h3>
      <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] leading-relaxed mt-0.5">{desc}</p>
    </div>
  </div>
);

/* ─── Phone mockup screen ────────────────────────────────────────── */
const PhoneMockup: React.FC = () => (
  <div className="relative mx-auto" style={{ width: '260px' }}>
    {/* Phone frame */}
    <div className="relative rounded-[40px] border-[8px] border-[#172B23] dark:border-[#293B31] bg-[#172B23] shadow-2xl shadow-[#172B23]/40 overflow-hidden" style={{ height: '520px' }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#172B23] dark:bg-[#293B31] rounded-b-xl z-20" />

      {/* Screen */}
      <div className="absolute inset-0 bg-[#0B110F] flex flex-col overflow-hidden rounded-[32px]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-7 pb-2 shrink-0">
          <span className="text-[10px] text-white/70 font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 rounded-sm bg-white/70" />
            <div className="w-3.5 h-1.5 rounded-sm bg-white/70" />
            <div className="w-4 h-2 rounded-sm bg-white/70" />
          </div>
        </div>

        {/* App header */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#138A5B] to-[#0F766E] flex items-center justify-center">
              <Leaf className="w-2.5 h-2.5 text-[#B8F34A]" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-white">EcoTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#1B382B] flex items-center justify-center">
              <Activity className="w-2.5 h-2.5 text-[#43D99A]" />
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 overflow-hidden px-3 pb-2 space-y-2.5">
          {/* Greeting */}
          <div className="px-1">
            <p className="text-[10px] text-[#8FA196] font-medium">Good morning 👋</p>
            <p className="text-sm font-bold text-white leading-tight">Kasun Perera</p>
          </div>

          {/* Report Waste Card */}
          <div className="rounded-2xl p-3 bg-gradient-to-br from-[#138A5B] to-[#0F766E] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wide">Quick Action</p>
                <p className="text-sm font-bold text-white mt-0.5">Report Waste</p>
                <p className="text-[10px] text-emerald-100 mt-1">Tap to report illegal dumping</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Waste categories */}
          <div>
            <p className="text-[10px] font-bold text-[#8FA196] uppercase tracking-wider px-1 mb-1.5">Waste Categories</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Plastic', color: '#1E6DD3', bg: '#0D2D5C', icon: '♻️' },
                { label: 'Organic', color: '#22c55e', bg: '#052e16', icon: '🌿' },
                { label: 'Glass', color: '#0ea5e9', bg: '#082f49', icon: '🔵' },
                { label: 'Metal', color: '#6b7280', bg: '#111827', icon: '⚙️' },
                { label: 'E-Waste', color: '#a855f7', bg: '#2e1065', icon: '📱' },
                { label: 'Mixed', color: '#f59e0b', bg: '#451a03', icon: '🗑️' },
              ].map((cat) => (
                <div key={cat.label} className="rounded-xl p-2 flex flex-col items-center gap-1" style={{ backgroundColor: cat.bg }}>
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-[9px] font-semibold" style={{ color: cat.color }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map thumbnail */}
          <div className="rounded-xl overflow-hidden bg-[#1B2922] h-14 relative">
            <div className="absolute inset-0 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#43D99A] animate-ping opacity-75" />
              <p className="text-[10px] text-[#8FA196] font-medium">GPS Location Active</p>
              <MapPin className="w-3 h-3 text-[#43D99A]" />
            </div>
            {/* Mini map dots */}
            <div className="absolute top-3 left-8 w-1.5 h-1.5 rounded-full bg-[#43D99A]/50" />
            <div className="absolute top-5 left-20 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
            <div className="absolute bottom-3 right-10 w-1.5 h-1.5 rounded-full bg-amber-400/50" />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-around px-2 py-3 border-t border-[#293B31] bg-[#0B110F] shrink-0">
          {[
            { icon: <LayoutDashboardIcon />, label: 'Home', active: true },
            { icon: <FilesIcon />, label: 'Reports', active: false },
            { icon: <PlusIcon />, label: 'Add', active: false, primary: true },
            { icon: <RecycleIcon />, label: 'Recycle', active: false },
            { icon: <GiftIcon />, label: 'Rewards', active: false },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              {item.primary ? (
                <div className="w-7 h-7 rounded-full bg-[#138A5B] flex items-center justify-center shadow-lg shadow-[#138A5B]/40">
                  {item.icon}
                </div>
              ) : (
                <div className={`${item.active ? 'text-[#43D99A]' : 'text-[#46574F]'}`}>{item.icon}</div>
              )}
              <span className={`text-[8px] font-medium ${item.active ? 'text-[#43D99A]' : 'text-[#46574F]'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Side buttons */}
    <div className="absolute right-[-8px] top-24 w-1 h-8 bg-[#172B23] rounded-r-sm" />
    <div className="absolute left-[-8px] top-20 w-1 h-6 bg-[#172B23] rounded-l-sm" />
    <div className="absolute left-[-8px] top-28 w-1 h-10 bg-[#172B23] rounded-l-sm" />
  </div>
);

/* Tiny inline icon components for phone mockup */
const LayoutDashboardIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const FilesIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const RecycleIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>;
const GiftIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;

/* ─── Floating glass card ────────────────────────────────────────── */
interface FloatingCardProps { children: React.ReactNode; className?: string; }
const FloatingCard: React.FC<FloatingCardProps> = ({ children, className }) => (
  <div className={`rounded-2xl bg-white/90 dark:bg-[#141E19]/90 border border-[#DFE8E2] dark:border-[#293B31] backdrop-blur-sm shadow-xl shadow-black/8 p-4 ${className || ''}`}>
    {children}
  </div>
);

/* ─── Scroll reveal helper ───────────────────────────────────────── */
const useScrollReveal = () => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
};

/* ─── Section ────────────────────────────────────────────────────── */
const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}
    >
      {children}
    </div>
  );
};

/* ─── Main LandingPage ───────────────────────────────────────────── */
export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const stats = [
    { value: '10K+', label: 'Active Citizens', icon: <Users className="w-4 h-4" /> },
    { value: '25+', label: 'Municipal Councils', icon: <Building2 className="w-4 h-4" /> },
    { value: '100+', label: 'Recycling Centers', icon: <Recycle className="w-4 h-4" /> },
    { value: '3 Lang', label: 'EN · සිං · த', icon: <Globe className="w-4 h-4" /> },
  ];

  const features = [
    { icon: <Camera className="w-4 h-4" />, title: 'Report with a Photo', desc: 'Submit waste reports with GPS-tagged images in seconds.' },
    { icon: <MapPin className="w-4 h-4" />, title: 'Pin the Location', desc: 'Attach precise GPS coordinates to every report.' },
    { icon: <Activity className="w-4 h-4" />, title: 'Track Progress', desc: 'Monitor collection and resolution status in real time.' },
    { icon: <ShieldCheck className="w-4 h-4" />, title: 'Support a Cleaner Sri Lanka', desc: 'Help build cleaner communities across the island.' },
  ];

  const howItWorks = [
    {
      step: '01',
      icon: <Camera className="w-6 h-6" />,
      title: 'Snap & Pin',
      desc: 'Photograph illegal dumping, AI classifies the waste category and captures your GPS location automatically.',
      color: 'from-[#138A5B] to-[#0F766E]',
    },
    {
      step: '02',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Council Triage',
      desc: 'Municipal officers review reports, assign crews, and optimize compactor truck routes to minimize emissions.',
      color: 'from-[#0F766E] to-[#0E734A]',
    },
    {
      step: '03',
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Verified Resolution',
      desc: 'Field crews upload photo evidence on task completion. SLA compliance is tracked and audited automatically.',
      color: 'from-[#0D5C3A] to-[#138A5B]',
    },
  ];

  const capabilities = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Waste Classification',
      desc: 'Automatically identifies organic, plastic, glass, e-waste, and hazardous materials from photos. Flags low-confidence results for human review.',
      badge: 'AI-Powered',
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Circular Rewards',
      desc: 'Earn verified Green Points for recycling. Points are tracked in a transparent, auditable double-entry ledger.',
      badge: 'Rewards',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Offline Field PWA',
      desc: 'Drivers and sanitation workers update tasks offline via IndexedDB. Data syncs automatically when reconnected.',
      badge: 'Offline-First',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Progressive Web App',
      desc: 'Install EcoTrack on any device. No app store required. Works seamlessly on Android, iOS, and desktop browsers.',
      badge: 'PWA',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Trilingual Platform',
      desc: 'Full support for English, Sinhala (සිංහල), and Tamil (தமிழ்). Localized for Sri Lankan administrative standards.',
      badge: 'Localized',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'CEA Compliant',
      desc: 'Waste categorization follows Central Environmental Authority color-coded directives for Sri Lanka.',
      badge: 'Compliant',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0B110F] text-[#172B23] dark:text-[#F1F7F3] transition-colors overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 lg:px-8 overflow-hidden">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#138A5B]/8 dark:bg-[#138A5B]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-[#0F766E]/6 dark:bg-[#0F766E]/4 rounded-full blur-3xl" />
          <FloatingLeaf style={{ top: '12%', right: '8%', animationDelay: '0s' }} />
          <FloatingLeaf style={{ top: '55%', left: '3%', animationDelay: '1.5s' }} />
          <FloatingLeaf style={{ bottom: '15%', right: '18%', animationDelay: '3s' }} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* LEFT — Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4F4EA] dark:bg-[#1B382B] border border-[#C1E4D0] dark:border-[#293B31] text-[#138A5B] dark:text-[#43D99A] text-[12px] font-semibold mb-6 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#138A5B] dark:bg-[#43D99A] animate-pulse" />
                A Cleaner · Greener · Healthier Sri Lanka
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6">
                A Cleaner Sri Lanka<br />
                Starts With{' '}
                <span className="bg-gradient-to-r from-[#138A5B] to-[#0F766E] bg-clip-text text-transparent">
                  You.
                </span>
              </h1>

              <p className="text-[15px] sm:text-base text-[#46574F] dark:text-[#C1CEC5] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Report waste, track progress, find recycling centers, and help your community stay clean with EcoTrack — Sri Lanka's AI-powered waste management platform.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                <Link
                  to={user ? '/resident/report-waste' : '/login'}
                  className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-semibold text-[14px] shadow-lg shadow-[#138A5B]/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#138A5B]/35"
                >
                  <MapPin className="w-4 h-4" />
                  Report Waste
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/recycling-locator"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#141E19] hover:bg-[#EAF5EE] dark:hover:bg-[#1B2922] text-[#172B23] dark:text-[#F1F7F3] border border-[#DFE8E2] dark:border-[#293B31] font-semibold text-[14px] shadow-sm transition-all duration-200 hover:scale-[1.01]"
                >
                  <Recycle className="w-4 h-4 text-[#138A5B] dark:text-[#43D99A]" />
                  Explore Recycling Centers
                </Link>
              </div>

              {/* Quick feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {features.map((f) => (
                  <FeatureItem key={f.title} {...f} />
                ))}
              </div>
            </div>

            {/* RIGHT — Phone mockup */}
            <div className="flex-shrink-0 relative hidden lg:block">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#138A5B]/20 to-[#0F766E]/10 rounded-full blur-3xl scale-110" />

                <PhoneMockup />

                {/* Floating card A */}
                <FloatingCard className="absolute -left-28 top-16 w-52 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E4F4EA] dark:bg-[#1B382B] flex items-center justify-center text-[#138A5B] dark:text-[#43D99A]">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[11px] font-bold text-[#172B23] dark:text-[#F1F7F3]">Report in 3 Steps</p>
                  </div>
                  {['Take a photo', 'Add location', 'Submit report'].map((step, i) => (
                    <div key={step} className="flex items-center gap-2 py-0.5">
                      <div className="w-4 h-4 rounded-full bg-[#138A5B]/10 dark:bg-[#138A5B]/20 text-[#138A5B] dark:text-[#43D99A] flex items-center justify-center text-[9px] font-bold shrink-0">{i + 1}</div>
                      <span className="text-[11px] text-[#46574F] dark:text-[#C1CEC5]">{step}</span>
                    </div>
                  ))}
                </FloatingCard>

                {/* Floating card B */}
                <FloatingCard className="absolute -right-24 bottom-24 w-48 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-[#E4F4EA] dark:bg-[#1B382B] flex items-center justify-center text-[#138A5B] dark:text-[#43D99A]">
                      <Recycle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-[#172B23] dark:text-[#F1F7F3]">Nearest Depot</p>
                      <p className="text-[10px] text-[#46574F] dark:text-[#8FA196]">0.8 km away</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#138A5B] dark:text-[#43D99A]">Find Centers</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A]" />
                  </div>
                </FloatingCard>

                {/* Floating card C — points */}
                <FloatingCard className="absolute -left-20 bottom-16 w-44 hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#138A5B] to-[#0F766E] flex items-center justify-center shadow-md shadow-[#138A5B]/30">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-extrabold text-[#138A5B] dark:text-[#43D99A]">+90 pts</p>
                      <p className="text-[10px] text-[#46574F] dark:text-[#8FA196]">Green Points Earned</p>
                    </div>
                  </div>
                </FloatingCard>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <RevealSection>
        <section className="py-10 border-y border-[#DFE8E2] dark:border-[#293B31] bg-[#F0F5F2] dark:bg-[#101916] transition-colors">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <RevealSection>
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] uppercase tracking-widest mb-3">
                <Zap className="w-3.5 h-3.5" /> Streamlined Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] mt-1">
                How EcoTrack Works in 3 Steps
              </h2>
              <p className="text-[#46574F] dark:text-[#C1CEC5] mt-4 max-w-xl mx-auto text-[15px]">
                From a citizen's photo to a verified resolution — EcoTrack orchestrates the entire waste management lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorks.map((step, i) => (
                <div key={step.step} className="relative group">
                  {/* Connector line */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[calc(100%+0.75rem)] w-6 border-t-2 border-dashed border-[#C1E4D0] dark:border-[#293B31] z-10" />
                  )}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] uppercase tracking-widest mb-1">Step {step.step}</div>
                        <h3 className="text-base font-bold text-[#172B23] dark:text-[#F1F7F3] mb-2">{step.title}</h3>
                        <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── CAPABILITIES GRID ─────────────────────────────────────── */}
      <RevealSection>
        <section className="py-20 px-6 lg:px-8 bg-white dark:bg-[#0F1712] border-y border-[#DFE8E2] dark:border-[#293B31] transition-colors">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] mt-1">
                Built for Sri Lanka's Unique Challenges
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {capabilities.map((cap) => (
                <div key={cap.title} className="p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] hover:shadow-md hover:border-[#C1E4D0] dark:hover:border-[#293B31] hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#E4F4EA] dark:bg-[#1B382B] flex items-center justify-center text-[#138A5B] dark:text-[#43D99A] group-hover:bg-[#138A5B] group-hover:text-white dark:group-hover:bg-[#138A5B] transition-colors duration-200">
                      {cap.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4F4EA] dark:bg-[#1B382B] text-[#138A5B] dark:text-[#43D99A]">
                      {cap.badge}
                    </span>
                  </div>
                  <h3 className="text-[14.5px] font-bold text-[#172B23] dark:text-[#F1F7F3] mb-2">{cap.title}</h3>
                  <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <RevealSection>
        <section className="py-20 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#138A5B] via-[#0E734A] to-[#0F766E] p-10 sm:p-14 text-white shadow-2xl shadow-[#138A5B]/30">
              {/* BG decoration */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/3 rounded-full" />
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-[12px] font-semibold mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Free for Citizens · Always
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
                    Ready to Make an Impact?
                  </h3>
                  <p className="text-[15px] text-emerald-100 max-w-md">
                    Join thousands of Sri Lankan residents and municipal teams transforming our communities.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <Link
                    to="/register"
                    className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-[#138A5B] font-bold text-[14px] shadow-lg hover:bg-[#F0F5F2] transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
                  >
                    Create Citizen Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-white/30 hover:border-white/60 text-white font-semibold text-[14px] transition-all duration-200 whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

    </div>
  );
};
