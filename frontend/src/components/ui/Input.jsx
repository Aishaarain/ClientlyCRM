import clsx from 'clsx';

export function Field({ label, hint, error, children }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-semibold text-ink">{label}</span> : null}
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx('w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10', className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={clsx('min-h-32 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10', className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={clsx('w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10', className)}
      {...props}
    >
      {children}
    </select>
  );
}
