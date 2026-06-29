import clsx from 'clsx';

const variants = {
  primary: 'bg-primary text-white shadow-lg shadow-blue-500/20 hover:bg-primary-dark',
  secondary: 'bg-white text-ink ring-1 ring-line hover:bg-slate-50',
  ghost: 'bg-transparent text-muted hover:bg-white/70 hover:text-ink',
  danger: 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700',
  gradient: 'bg-gradient-to-r from-primary via-cyan to-pink text-white shadow-lg shadow-blue-500/20',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export default function Button({ children, className, variant = 'primary', size = 'md', loading = false, disabled = false, type = 'button', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  );
}
