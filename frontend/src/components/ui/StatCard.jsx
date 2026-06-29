import clsx from 'clsx';
import Card from './Card.jsx';

export default function StatCard({ label, value, icon: Icon, tone = 'blue', meta }) {
  const tones = {
    blue: 'from-primary to-cyan text-white',
    pink: 'from-pink to-purple text-white',
    green: 'from-emerald-500 to-teal-400 text-white',
    amber: 'from-amber-400 to-orange-500 text-white',
    slate: 'from-slate-700 to-slate-500 text-white',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{label}</p>
          <h3 className="mt-2 text-3xl font-black text-ink">{value}</h3>
          {meta ? <p className="mt-2 text-xs font-medium text-muted">{meta}</p> : null}
        </div>
        {Icon ? (
          <div className={clsx('rounded-2xl bg-gradient-to-br p-3 shadow-lg', tones[tone])}>
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
