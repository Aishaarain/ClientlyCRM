import { Sparkles } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description = 'Start by creating a new item.' }) {
  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-cyan/10 text-primary">
        <Sparkles size={22} />
      </div>
      <h3 className="text-base font-black text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
