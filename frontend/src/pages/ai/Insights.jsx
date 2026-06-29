import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, Textarea } from '../../components/ui/Input.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import AIResultCard from './AIResultCard.jsx';
import { aiApi } from '../../api/aiApi.js';

export default function Insights() {
  const [query, setQuery] = useState('Which clients are most at risk and why?');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ask = async (e) => {
    e.preventDefault(); setOutput(''); setError(''); setLoading(true);
    try { await aiApi.queryInsights({ query }, (_, full) => setOutput(full)); }
    catch (err) { setError(err.message || 'Could not generate insight'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="AI Studio" title="CRM insights" description="Ask business questions and get concise answers from at-risk client data." />
      <ErrorBanner message={error} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="space-y-4" onSubmit={ask}>
            <Field label="Question"><Textarea required value={query} onChange={(e) => setQuery(e.target.value)} /></Field>
            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>Ask Velora AI</Button>
          </form>
        </Card>
        <AIResultCard title="Insight answer" text={output} />
      </div>
    </div>
  );
}
