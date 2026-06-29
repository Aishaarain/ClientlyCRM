import FloatingOrb from '../../components/three/FloatingOrb.jsx';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-soft velora-grid">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr]">

        {/* Hero section — top on mobile, left on desktop */}
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-primary-dark to-purple p-8 text-white lg:p-10">
          <FloatingOrb />

          <div className="relative z-10 w-full max-w-lg py-6 lg:py-0">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan" /> AI-powered CRM dashboard
            </div>

            <h1 className="text-4xl font-black tracking-tight lg:text-6xl">
              Cliently turns client work into smart workflows.
            </h1>

            <p className="mt-4 text-base leading-7 text-white/75 lg:mt-6 lg:text-lg lg:leading-8">
              Manage clients, projects, invoices, follow-ups, risk detection, and AI content from one polished portfolio-ready SaaS interface.
            </p>
          </div>

          {/* Bottom-right badge — desktop only */}
          <div className="absolute bottom-10 right-10 hidden rounded-[2rem] bg-white/10 p-5 backdrop-blur-xl lg:block">
            <p className="text-sm font-bold text-white/70">2026</p>
            <p className="mt-1 text-2xl font-black">AI CRM SaaS</p>
          </div>
        </section>

        {/* Form section — below on mobile, right on desktop */}
        <section className="flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-card backdrop-blur">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-primary via-cyan to-pink text-2xl font-black text-white shadow-lg shadow-primary/20">
                C
              </div>
              <h2 className="text-3xl font-black text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>

      </div>
    </div>
  );
}