import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input, { Field, Select, Textarea } from '../../components/ui/Input.jsx';

const initial = { name: '', email: '', company: '', phone: '', status: 'active', tags: '', notes: '' };

export default function ClientForm({ defaultValues, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...initial, ...defaultValues, tags: Array.isArray(defaultValues?.tags) ? defaultValues.tags.join(', ') : defaultValues?.tags || '' });

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: String(form.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client name"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Email"><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Company"><Input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
        <Field label="Phone"><Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Status">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="at-risk">At-risk</option>
          </Select>
        </Field>
        <Field label="Tags" hint="Separate tags with commas"><Input value={form.tags || ''} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, web design" /></Field>
      </div>
      <Field label="Notes"><Textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save client</Button>
      </div>
    </form>
  );
}
