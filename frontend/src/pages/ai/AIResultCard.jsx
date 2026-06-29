import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';

export default function AIResultCard({ title = 'Generated content', text, onCopy }) {
  return (
    <Card className="min-h-72">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-ink">{title}</h3>
        <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(text || ''); onCopy?.(); }} disabled={!text}>Copy</Button>
      </div>
      <div className="whitespace-pre-wrap rounded-2xl bg-soft p-5 text-sm leading-7 text-ink">
        {text || 'AI output will stream here in real time.'}
      </div>
    </Card>
  );
}
