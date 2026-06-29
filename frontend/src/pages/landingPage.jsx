import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, FolderKanban, FileText, Sparkles,
  ShieldAlert, UserCog, ArrowRight, ChevronDown,
} from 'lucide-react';
import FloatingOrb from '../components/three/FloatingOrb';

/* ─── tiny hook: intersection observer for scroll reveals ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── animated counter ─── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── feature data ─── */
const features = [
  {
    icon: Users,
    color: 'from-cyan to-primary',
    title: 'Client Management',
    desc: 'Centralise every client — contact info, status, linked projects, invoices, and interaction history in one place.',
  },
  {
    icon: FolderKanban,
    color: 'from-primary to-purple',
    title: 'Project Tracking',
    desc: 'Create projects, assign freelancers, set budgets and deadlines. Everything scoped to your workspace.',
  },
  {
    icon: FileText,
    color: 'from-purple to-pink',
    title: 'Invoice Center',
    desc: 'Generate, track, and manage invoices with live payment status. Know exactly who owes what.',
  },
  {
    icon: Sparkles,
    color: 'from-pink to-cyan',
    title: 'AI Proposals',
    desc: 'Generate client proposals and follow-up emails in seconds using built-in AI — tailored to each project.',
  },
  {
    icon: ShieldAlert,
    color: 'from-orange-400 to-pink',
    title: 'Risk Center',
    desc: 'Automatically flag at-risk clients based on overdue invoices, stalled projects, and inactivity signals.',
  },
  {
    icon: UserCog,
    color: 'from-cyan to-purple',
    title: 'Team & Roles',
    desc: 'Invite freelancers to your workspace. Admins control everything; freelancers see only what\'s assigned to them.',
  },
];

/* ─── feature card ─── */
function FeatureCard({ icon: Icon, color, title, desc, index }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="group rounded-3xl border border-line bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, box-shadow 0.3s ease`,
      }}
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
    </div>
  );
}

/* ─── main page ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [featuresRef, featuresVisible] = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-soft velora-grid overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary via-cyan to-pink text-sm font-black text-white shadow-md shadow-primary/20">
              C
            </div>
            <span
              className="text-lg font-black transition-colors duration-300"
              style={{ color: scrolled ? 'var(--color-ink)' : 'white' }}
            >
              Cliently CRM
            </span>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="rounded-full px-5 py-2 text-sm max-md:hidden font-bold transition-all duration-200"
              style={{ color: scrolled ? 'var(--color-ink)' : 'white' }}
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-ink shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-primary-dark to-purple px-6 pt-20 text-white">
        <FloatingOrb />

        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--color-cyan)' }}
          />
          <div
            className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--color-pink)' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Pill badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur"
            style={{ animation: 'fadeDown 0.6s ease both' }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
            AI-powered freelance CRM
          </div>

          {/* Headline */}
          <h1
            className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animation: 'fadeUp 0.7s ease 0.1s both' }}
          >
            Client work,{' '}
            <span className="bg-gradient-to-r from-cyan via-white to-pink bg-clip-text text-transparent">
              finally organised.
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70"
            style={{ animation: 'fadeUp 0.7s ease 0.2s both' }}
          >
            Cliently brings clients, projects, invoices, AI proposals, and team management
            into one clean workspace — built for freelancers who mean business.
          </p>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animation: 'fadeUp 0.7s ease 0.3s both' }}
          >
            <button
              onClick={() => navigate('/register')}
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-black text-ink shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Start for free
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-all duration-200 hover:border-white/60 hover:bg-white/10"
            >
              Log in
            </button>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 grid grid-cols-3 gap-6 rounded-3xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-sm sm:px-12"
            style={{ animation: 'fadeUp 0.7s ease 0.4s both' }}
          >
            {[
              { value: 6, suffix: '+', label: 'Core modules' },
              { value: 100, suffix: '%', label: 'Role-scoped data' },
              { value: 1, suffix: ' workspace', label: 'Everything connected' },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-white sm:text-3xl">
                  <Counter target={value} suffix={suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
          style={{ animation: 'fadeUp 1s ease 0.8s both' }}>
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div
          ref={featuresRef}
          className="mb-14 text-center transition-all duration-700"
          style={{
            opacity: featuresVisible ? 1 : 0,
            transform: featuresVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-primary">Everything you need</p>
          <h2 className="mt-3 text-4xl font-black text-ink lg:text-5xl">
            One workspace.<br />Zero scattered tabs.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
            Every tool a freelancer needs to run a professional client operation — no duct tape required.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <CtaBanner onNavigate={navigate} />

      {/* ── Footer ── */}
      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-primary via-cyan to-pink text-xs font-black text-white">
            C
          </div>
          <span className="font-black text-ink">Cliently CRM</span>
        </div>
        <p>Built by aisha arain · {new Date().getFullYear()}</p>
      </footer>

      {/* ── Global keyframe styles ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── CTA Banner (separate so it gets its own reveal) ─── */
function CtaBanner({ onNavigate }) {
  const [ref, visible] = useReveal();
  return (
    <section className="px-6 pb-24">
      <div
        ref={ref}
        className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-ink via-primary-dark to-purple p-12 text-center text-white shadow-2xl transition-all duration-700 relative"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
        }}
      >
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-cyan opacity-20 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-pink opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-widest text-white/50">Ready?</p>
          <h2 className="mt-3 text-4xl font-black lg:text-5xl">
            Your client dashboard<br />is waiting.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/65">
            Set up your workspace, invite your team, and start managing clients the right way.
          </p>
          <button
            onClick={() => onNavigate('/register')}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-ink shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Create your workspace
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}