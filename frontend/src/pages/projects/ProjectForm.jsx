import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input, { Field, Select, Textarea } from '../../components/ui/Input.jsx';
import { clientApi } from '../../api/clientApi.js';
import { toArray } from '../../utils/normalize.js';

const initial = { clientId: '', title: '', description: '', budget: '', currency: 'USD', status: 'lead', startDate: '', endDate: '', deliverables: '' };

export default function ProjectForm({ defaultValues, onSubmit, onCancel, loading }) {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    ...initial,
    ...defaultValues,
    clientId: defaultValues?.clientId?._id || defaultValues?.clientId || '',
    startDate: defaultValues?.startDate?.slice?.(0, 10) || '',
    endDate: defaultValues?.endDate?.slice?.(0, 10) || '',
    deliverables: Array.isArray(defaultValues?.deliverables) ? defaultValues.deliverables.join(', ') : defaultValues?.deliverables || '',
  });

  useEffect(() => { clientApi.getClients({ limit: 100 }).then((res) => setClients(toArray(res))).catch(() => {}); }, []);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      budget: Number(form.budget) || 0,
      deliverables: String(form.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean),
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Client">
        <Select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
          <option value="">Select client</option>
          {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </Select>
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Project title"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="lead">Lead</option><option value="active">Active</option><option value="completed">Completed</option><option value="paused">Paused</option></Select></Field>
        <Field label="Budget"><Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></Field>
        <Field label="Currency"><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} /></Field>
        <Field label="Start date"><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
        <Field label="End date"><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
      </div>
      <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <Field label="Deliverables" hint="Separate deliverables with commas"><Input value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} /></Field>
      <div className="flex justify-end gap-3"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" loading={loading}>Save project</Button></div>
    </form>
  );
}
