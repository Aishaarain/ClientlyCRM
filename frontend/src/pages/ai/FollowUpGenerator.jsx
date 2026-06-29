import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, Select } from '../../components/ui/Input.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import AIResultCard from './AIResultCard.jsx';
import { clientApi } from '../../api/clientApi.js';
import { invoiceApi } from '../../api/invoiceApi.js';
import { aiApi } from '../../api/aiApi.js';
import { toArray } from '../../utils/normalize.js';

export default function FollowUpGenerator() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ clientId: '', invoiceId: '' });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { clientApi.getClients({ limit: 100 }).then((res) => setClients(toArray(res.clients ?? res.data ?? res))).catch(() => {});}, []);
  useEffect(() => { if (form.clientId) invoiceApi.getInvoices({ clientId: form.clientId }).then((res) => setInvoices(toArray(res.invoices ?? res.data ?? res))).catch(() => setInvoices([])); }, [form.clientId]);

  const generate = async (e) => {
    e.preventDefault(); setOutput(''); setError(''); setLoading(true);
    try { await aiApi.generateFollowUp(form, (_, full) => setOutput(full)); }
    catch (err) { setError(err.message || 'Could not generate follow-up'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="AI Studio" title="Payment follow-up" description="Generate friendly, firm, or urgent payment follow-up emails depending on invoice due date." />
      <ErrorBanner message={error} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="space-y-4" onSubmit={generate}>
            <Field label="Client"><Select required value={form.clientId} onChange={(e) => setForm({ clientId: e.target.value, invoiceId: '' })}><option value="">Select client</option>{clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</Select></Field>
            <Field label="Invoice"><Select required value={form.invoiceId} onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}><option value="">Select invoice</option>{invoices.map((i) => <option key={i._id} value={i._id}>{i.invoiceNumber} • {i.status}</option>)}</Select></Field>
            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>Generate follow-up</Button>
          </form>
        </Card>
        <AIResultCard title="Follow-up email" text={output} />
      </div>
    </div>
  );
}
