import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage, Language } from '../context/LanguageContext.js';

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
        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] placeholder:text-[#8FA196] dark:placeholder:text-[#46574F] focus:outline-none focus:ring-2 focus:ring-[#138A5B] dark:focus:ring-[#43D99A] focus:border-transparent transition-all"
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
  </div>
);

/* ─── Main RegisterPage ───────────────────────────────────────────── */
export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'si' | 'ta'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialNote, setSocialNote] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSocialNote('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setLoading(true);

    try {
      // Clean phone number ensuring Sri Lanka format
      let formattedPhone = phone.trim();
      if (formattedPhone && !formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+94' + formattedPhone.slice(1);
        } else if (!formattedPhone.startsWith('94')) {
          formattedPhone = '+94' + formattedPhone;
        } else {
          formattedPhone = '+' + formattedPhone;
        }
      }

      const res = await api.post('/auth/register', {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: formattedPhone || undefined,
        password,
        preferredLanguage,
      });

      if (res.data.success) {
        login(res.data.data.accessToken, res.data.data.user);
        navigate('/resident/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    setSocialNote(`${provider} authentication is coming soon. Please sign up using email & password.`);
    setTimeout(() => setSocialNote(''), 4500);
  };

  const benefits = [
    {
      icon: <Users className="w-4 h-4 text-emerald-200" />,
      title: 'Join the Community',
      desc: 'Report, recycle and create cleaner surroundings.',
    },
    {
      icon: <Award className="w-4 h-4 text-emerald-200" />,
      title: 'Earn Rewards',
      desc: 'Get Green Points for recycling and reporting verified waste.',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-emerald-200" />,
      title: 'Make an Impact',
      desc: 'Support a sustainable, litter-free Sri Lanka for future generations.',
    },
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
                  Join the Movement
                </div>

                <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2">
                  Create{' '}
                  <span className="text-[#B8F34A]">Your Account</span>
                </h2>
                <p className="text-[14px] text-emerald-100 mb-8 leading-relaxed">
                  Be part of a cleaner, greener Sri Lanka. Together we can make a real difference.
                </p>

                <div className="space-y-5">
                  {benefits.map((b) => (
                    <Benefit key={b.title} {...b} />
                  ))}
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
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] mb-1">
                  Create an Account
                </h3>
                <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mb-6">
                  Join EcoTrack Sri Lanka. Start your journey towards a cleaner environment.
                </p>

                {error && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-[12px] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {socialNote && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-[12px]">
                    {socialNote}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <FormInput
                    id="register-name"
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Kasun Perera"
                    icon={<User className="w-4 h-4" />}
                    required
                    autoComplete="name"
                  />

                  {/* Email */}
                  <FormInput
                    id="register-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="kasun@example.lk"
                    icon={<Mail className="w-4 h-4" />}
                    required
                    autoComplete="email"
                  />

                  {/* Phone with Sri Lanka prefix */}
                  <div>
                    <label htmlFor="register-phone" className="block text-[12px] font-semibold text-[#172B23] dark:text-[#C1CEC5] mb-1.5">
                      Phone Number (Sri Lanka)
                    </label>
                    <div className="relative flex">
                      <div className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-l-xl border border-r-0 border-[#DFE8E2] dark:border-[#293B31] bg-[#F0F5F2] dark:bg-[#1B2922] text-[12px] font-semibold text-[#172B23] dark:text-[#F1F7F3] select-none">
                        <Phone className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A]" />
                        <span>+94</span>
                      </div>
                      <input
                        id="register-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="77 123 4567"
                        autoComplete="tel-national"
                        className="w-full px-3 py-2.5 rounded-r-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] placeholder:text-[#8FA196] dark:placeholder:text-[#46574F] focus:outline-none focus:ring-2 focus:ring-[#138A5B] dark:focus:ring-[#43D99A] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password in 2 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="register-password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={setPassword}
                      placeholder="Min 6 chars"
                      icon={<Lock className="w-4 h-4" />}
                      required
                      autoComplete="new-password"
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

                    <FormInput
                      id="register-confirm-password"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      placeholder="Repeat password"
                      icon={<Lock className="w-4 h-4" />}
                      required
                      autoComplete="new-password"
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                          className="text-[#8FA196] hover:text-[#138A5B] dark:hover:text-[#43D99A] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label htmlFor="register-lang" className="block text-[12px] font-semibold text-[#172B23] dark:text-[#C1CEC5] mb-1.5">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA196] dark:text-[#46574F] pointer-events-none">
                        <Globe className="w-4 h-4" />
                      </div>
                      <select
                        id="register-lang"
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value as any)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] focus:outline-none focus:ring-2 focus:ring-[#138A5B] dark:focus:ring-[#43D99A] transition-all cursor-pointer"
                      >
                        <option value="en">English (default)</option>
                        <option value="si">සිංහල (Sinhala)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                      </select>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-[#DFE8E2] text-[#138A5B] focus:ring-[#138A5B] shrink-0"
                      />
                      <span className="text-[12px] text-[#46574F] dark:text-[#8FA196] leading-snug">
                        I agree to the{' '}
                        <a href="#terms" onClick={(e) => { e.preventDefault(); alert('EcoTrack Sri Lanka Terms: By creating an account you agree to accurate reporting and community guidelines.'); }} className="text-[#138A5B] dark:text-[#43D99A] font-semibold hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('EcoTrack Sri Lanka Privacy: Your location and contact information are protected and used strictly for waste collection dispatch.'); }} className="text-[#138A5B] dark:text-[#43D99A] font-semibold hover:underline">
                          Privacy Policy
                        </a>.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-semibold text-[14px] shadow-lg shadow-[#138A5B]/25 transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account…
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#DFE8E2] dark:bg-[#293B31]" />
                  <span className="text-[11px] font-bold text-[#8FA196] uppercase tracking-wider">OR</span>
                  <div className="flex-1 h-px bg-[#DFE8E2] dark:bg-[#293B31]" />
                </div>

                {/* Social Login buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSocialClick('Google')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] text-[12px] font-semibold text-[#172B23] dark:text-[#F1F7F3] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialClick('Apple')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-[#F8FAF8] dark:bg-[#1B2922] hover:bg-[#EAF5EE] dark:hover:bg-[#202F27] text-[12px] font-semibold text-[#172B23] dark:text-[#F1F7F3] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current text-[#172B23] dark:text-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-.95 2.76.99.08 2.05-.51 2.67-1.26" />
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-[13px] text-[#46574F] dark:text-[#8FA196]">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-[#138A5B] dark:text-[#43D99A] hover:underline">
                    Sign in
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
