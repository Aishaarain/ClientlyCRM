export default function ProgressRing({ value = 0, label = 'Risk' }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const bg = `conic-gradient(#FF007C ${safeValue * 3.6}deg, #E6E6E6 0deg)`;
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-16 w-16 place-items-center rounded-full" style={{ background: bg }}>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-black text-ink">{safeValue}</div>
      </div>
      <div>
        <p className="text-sm font-black text-ink">{label} score</p>
        <p className="text-xs text-muted">0 safe · 100 risky</p>
      </div>
    </div>
  );
}
