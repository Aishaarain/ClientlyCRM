import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input, { Field, Select, Textarea } from '../../components/ui/Input.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import { clientApi } from '../../api/clientApi.js';
import { projectApi } from '../../api/projectApi.js';
import { invoiceApi } from '../../api/invoiceApi.js';
import { toArray } from '../../utils/normalize.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const blankItem = { description: '', quantity: 1, rate: 0 };

export default function CreateInvoice() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ clientId: '', projectId: '', dueDate: '', tax: 0, notes: '', lineItems: [{ ...blankItem }] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { clientApi.getClients({ limit: 100 }).then((res) => setClients(toArray(res.clients ?? res.data ?? res))).catch(() => {});}, []);

  useEffect(() => {
  if (!form.clientId) { setProjects([]); return; }
 projectApi.getProjects({ clientId: form.clientId })
  .then((res) => setProjects(toArray(res.projects ?? res.docs ?? res.data ?? res)))
    .catch(() => setProjects([]));
}, [form.clientId]);

// ✅ Auto-fill when project is selected
useEffect(() => {
  if (!form.projectId) return;
  const project = projects.find((p) => p._id === form.projectId);
  if (!project) return;

  // Auto-fill a line item with the project budget
  setForm((prev) => ({
    ...prev,
    lineItems: [
      {
        description: project.title,
        quantity: 1,
        rate: project.budget || 0,
      },
    ],
    notes: project.description || prev.notes,
  }));
}, [form.projectId]);



  const subtotal = useMemo(() => form.lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0), [form.lineItems]);
  const total = subtotal + (Number(form.tax) || 0);

  const updateItem = (index, key, value) => {
    setForm((prev) => ({ ...prev, lineItems: prev.lineItems.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form, tax: Number(form.tax) || 0, projectId: form.projectId || undefined, lineItems: form.lineItems.map((item) => ({ ...item, quantity: Number(item.quantity) || 0, rate: Number(item.rate) || 0 })) };
      const invoice = await invoiceApi.createInvoice(payload);
      navigate(`/invoices/${invoice._id}`);
    } catch (err) { setError(err?.response?.data?.message || err.message || 'Could not create invoice'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="Billing" title="Create invoice" description="Add line items and let the backend calculate totals and invoice number." />
      <ErrorBanner message={error} />
      <form className="grid gap-6 xl:grid-cols-[1.4fr_0.7fr]" onSubmit={submit}>
        <Card className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Client"><Select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value, projectId: '' })}><option value="">Select client</option>{clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</Select></Field>
            <Field label="Project"><Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}><option value="">No project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}</Select></Field>
            <Field label="Due date"><Input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
            <Field label="Tax"><Input type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} /></Field>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-black text-ink">Line items</h3><Button variant="secondary" size="sm" onClick={() => setForm({ ...form, lineItems: [...form.lineItems, { ...blankItem }] })}><Plus size={15}/> Add item</Button></div>
            <div className="space-y-3">
              {form.lineItems.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-2xl bg-soft p-4 md:grid-cols-[1fr_100px_120px_44px]">
                  <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} required />
                  <Input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} required />
                  <Input type="number" min="0" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(index, 'rate', e.target.value)} required />
                  <Button variant="ghost" className="!p-3 text-rose-600" onClick={() => setForm({ ...form, lineItems: form.lineItems.filter((_, i) => i !== index) })} disabled={form.lineItems.length === 1}><Trash2 size={17}/></Button>
                </div>
              ))}
            </div>
          </div>
          <Field label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
        </Card>

        <Card className="h-max">
          <h3 className="text-lg font-black text-ink">Invoice summary</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-black">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Tax</span><span className="font-black">{formatCurrency(form.tax)}</span></div>
            <div className="border-t border-line pt-3 flex justify-between text-lg"><span className="font-black">Total</span><span className="font-black text-primary">{formatCurrency(total)}</span></div>
          </div>
          <Button type="submit" className="mt-6 w-full" size="lg" loading={saving}>Create invoice</Button>
        </Card>
      </form>
    </div>
  );
}
