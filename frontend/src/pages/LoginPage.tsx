import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Recycle,
  ChevronRight,
} from 'lucide-react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage, Language } from '../context/LanguageContext.js';
import { UserRole } from '../types.js';

/* ─── Logo ────────────────────────────────────────────────────────── */
const AuthLogo: React.FC = () => (
  <Link to="/" className="inline-flex items-center gap-2.5 group">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#138A5B] to-[#0F766E] flex items-center justify-center shadow-lg shadow-[#138A5B]/25 group-hover:scale-105 transition-transform duration-200">
      <Leaf className="w-5 h-5 text-[#B8F34A]" strokeWidth={2.5} />
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-[20px] font-bold tracking-tight text-[#172B23] dark:text-[#F1F7F3]">EcoTrack</span>
      <span className="text-[11px] text-[#46574F] dark:text-[#8FA196] font-medium">Sri Lanka</span>
    </div>
  </Link>
);

/* ─── Language + Theme bar ────────────────────────────────────────── */
const AuthTopBar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [dark, setDarkState] = useState<boolean>(() =>
    localStorage.getItem('ecotrack_theme') === 'dark' || document.documentElement.classList.contains('dark')
  );

  const toggleDark = () => {
    const next = !dark;
    setDarkState(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('ecotrack_theme', next ? 'dark' : 'light');
  };

  const langs: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'si', label: 'සිං' },
    { code: 'ta', label: 'த' },
  ];

  return (
    <div className="flex items-center justify-between py-4 px-6 lg:px-10">
      <AuthLogo />
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#F0F5F2] dark:bg-[#1B2922] rounded-lg p-0.5 border border-[#DFE8E2] dark:border-[#293B31] gap-0.5">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all ${
                language === l.code
                  ? 'bg-white dark:bg-[#293B31] text-[#138A5B] dark:text-[#43D99A] shadow-sm'
                  : 'text-[#46574F] dark:text-[#C1CEC5] hover:text-[#172B23] dark:hover:text-[#F1F7F3]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggleDark}
          aria-label="Toggle theme"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F5F2] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[#46574F] dark:text-[#C1CEC5] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] transition-colors"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
};

/* ─── Benefit item ────────────────────────────────────────────────── */
interface BenefitProps { icon: React.ReactNode; title: string; desc: string; }
const Benefit: React.FC<BenefitProps> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-white/15 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-[13px] font-semibold text-white">{title}</p>
      <p className="text-[12px] text-emerald-100/80 mt-0.5">{desc}</p>
    </div>
  </div>
);

/* ─── FormInput ───────────────────────────────────────────────────── */
interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  required?: boolean;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}
const FormInput: React.FC<FormInputProps> = ({ id, label, type, value, onChange, placeholder, icon, required, rightElement, autoComplete }) => (
  <div>
    <label htmlFor={id} className="block text-[12px] font-semibold text-[#172B23] dark:text-[#C1CEC5] mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA196] dark:text-[#46574F] pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full pl-9 pr-10 py-3 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] placeholder:text-[#8FA196] dark:placeholder:text-[#46574F] focus:outline-none focus:ring-2 focus:ring-[#138A5B] dark:focus:ring-[#43D99A] focus:border-transparent transition-all"
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
  </div>
);

/* ─── Main LoginPage ──────────────────────────────────────────────── */
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickLoginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.data.accessToken, res.data.data.user);
        redirectBasedOnRole(res.data.data.user.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case 'RESIDENT': navigate('/resident/dashboard'); break;
      case 'MUNICIPAL_OFFICER': navigate('/municipal/dashboard'); break;
      case 'COLLECTION_WORKER': case 'DRIVER': navigate('/worker/dashboard'); break;
      case 'RECYCLING_PARTNER': navigate('/partner/dashboard'); break;
      case 'SYSTEM_ADMIN': navigate('/admin/dashboard'); break;
      default: navigate('/');
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    setError('');
    try {
      await quickLoginAsRole(role);
      redirectBasedOnRole(role);
    } catch {
      setError('Could not log in as demo role. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <Activity className="w-4 h-4 text-emerald-200" />, title: 'Report Waste', desc: 'Help keep your community clean.' },
    { icon: <CheckCircle2 className="w-4 h-4 text-emerald-200" />, title: 'Track Progress', desc: 'See real-time collection status.' },
    { icon: <Recycle className="w-4 h-4 text-emerald-200" />, title: 'Earn Rewards', desc: 'Green Points for recycling.' },
  ];

  const demoRoles: { role: UserRole; name: string; sub: string }[] = [
    { role: 'RESIDENT', name: 'Resident', sub: 'Kasun Perera' },
    { role: 'MUNICIPAL_OFFICER', name: 'Municipal Officer', sub: 'Colombo MC' },
    { role: 'COLLECTION_WORKER', name: 'Field Worker', sub: 'Kamal Jayasinghe' },
    { role: 'RECYCLING_PARTNER', name: 'Recycling Partner', sub: 'EcoSpindles' },
    { role: 'DRIVER', name: 'Driver', sub: 'Bandara Jayawardena' },
    { role: 'SYSTEM_ADMIN', name: 'System Admin', sub: 'admin@ecotrack.lk' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0B110F] flex flex-col transition-colors">
      <AuthTopBar />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-black/15 border border-[#DFE8E2] dark:border-[#293B31]">

            {/* ── LEFT panel ───────────────────────────────────── */}
            <div className="lg:w-[45%] relative bg-gradient-to-br from-[#138A5B] via-[#0E734A] to-[#0F766E] p-8 lg:p-10 flex flex-col justify-between">
              {/* BG decorations */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/8 rounded-full" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-10 -translate-x-5" />
              </div>

              <div className="relative">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-[11px] font-semibold mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  A Cleaner Sri Lanka Starts With All of Us
                </div>

                <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2">
                  Welcome{' '}
                  <span className="text-[#B8F34A]">Back!</span>
                </h2>
                <p className="text-[14px] text-emerald-100 mb-8 leading-relaxed">
                  Sign in to continue your journey towards a cleaner, greener Sri Lanka.
                </p>

                <div className="space-y-4">
                  {benefits.map((b) => <Benefit key={b.title} {...b} />)}
                </div>
              </div>

              {/* Bottom slogan */}
              <div className="relative mt-10 pt-6 border-t border-white/20">
                <p className="text-[13px] text-emerald-100/80 font-medium italic">
                  "Cleaner Communities, Healthier Generations"
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-0.5 bg-white/30 rounded" />
                  <span className="text-[11px] text-white/50 font-medium">EcoTrack Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT panel — form ────────────────────────── */}
            <div className="flex-1 bg-white dark:bg-[#141E19] p-8 lg:p-10">
              <div className="max-w-sm mx-auto">
                <h3 className="text-2xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] mb-1">Sign In</h3>
                <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mb-7">
                  Welcome back to EcoTrack Sri Lanka. Continue your mission for a cleaner environment.
                </p>

                {error && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-[12px] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    id="login-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.lk"
                    icon={<Mail className="w-4 h-4" />}
                    required
                    autoComplete="email"
                  />

                  <FormInput
                    id="login-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    required
                    autoComplete="current-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="text-[#8FA196] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#DFE8E2] text-[#138A5B] focus:ring-[#138A5B]"
                      />
                      <span className="text-[12px] text-[#46574F] dark:text-[#8FA196]">Remember me</span>
                    </label>
                    <button type="button" className="text-[12px] font-semibold text-[#138A5B] dark:text-[#43D99A] hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-semibold text-[14px] shadow-lg shadow-[#138A5B]/25 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-6 pt-6 border-t border-[#DFE8E2] dark:border-[#293B31]">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#46574F] dark:text-[#8FA196] uppercase tracking-widest mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    1-Click Demo Accounts
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {demoRoles.map(({ role, name, sub }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleQuickDemo(role)}
                        disabled={loading}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAF8] dark:bg-[#1B2922] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] border border-[#DFE8E2] dark:border-[#293B31] text-left transition-colors group disabled:opacity-50"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#138A5B] to-[#0F766E] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-[#172B23] dark:text-[#F1F7F3] truncate">{name}</p>
                          <p className="text-[10px] text-[#8FA196] truncate">{sub}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-[#8FA196] shrink-0 group-hover:text-[#138A5B] dark:group-hover:text-[#43D99A] ml-auto transition-colors" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-[#8FA196] text-center">Password for all: <span className="font-mono font-bold">Password123!</span></p>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-[13px] text-[#46574F] dark:text-[#8FA196]">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-[#138A5B] dark:text-[#43D99A] hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
