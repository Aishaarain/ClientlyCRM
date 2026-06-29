import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input, { Field, Select, Textarea } from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import { clientApi } from '../../api/clientApi.js';
import { interactionApi } from '../../api/interactionApi.js';
import { toArray } from '../../utils/normalize.js';
import { formatDate } from '../../utils/formatDate.js';

export default function Interactions() {
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ clientId: '', type: 'email', direction: 'outbound', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [clientsRes, interactions] = await Promise.all([clientApi.getClients({ limit: 100 }), interactionApi.getInteractions()]);
     setClients(toArray(clientsRes.clients ?? clientsRes.data ?? clientsRes));
      setItems(interactions);
    } catch (err) { setError(err?.response?.data?.message || err.message || 'Could not load interactions'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try { await interactionApi.createInteraction(form); setModalOpen(false); setForm({ clientId: '', type: 'email', direction: 'outbound', content: '' }); await load(); }
    catch (err) { setError(err?.response?.data?.message || err.message || 'Could not save interaction'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="Communication" title="Interactions" description="Log emails, calls, meetings, and notes. Groq AI automatically tags client sentiment." actions={<Button onClick={() => setModalOpen(true)}><Plus size={18}/> Log interaction</Button>} />
      <ErrorBanner message={error} />
      {loading ? <Loader label="Loading interactions" /> : (
        <div className="grid gap-4">
          {items.map((item) => {
            const client = clients.find((c) => c._id === item.clientId || c._id === item.clientId?._id);
            return <Card key={item._id} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap gap-2"><Badge status={item.sentiment}>{item.sentiment}</Badge><span className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-muted capitalize">{item.type}</span><span className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-muted capitalize">{item.direction}</span></div>
                <h3 className="font-black text-ink">{client?.name || 'Client'}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.content}</p>
                {item.sentimentReason ? <p className="mt-2 text-xs font-medium text-primary">AI reason: {item.sentimentReason}</p> : null}
              </div>
              <p className="text-xs font-bold text-muted">{formatDate(item.loggedAt)}</p>
            </Card>;
          })}
          {!items.length ? <Card><p className="text-sm text-muted">No interactions logged yet.</p></Card> : null}
        </div>
      )}

      <Modal open={modalOpen} title="Log client interaction" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Client"><Select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}><option value="">Select client</option>{clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</Select></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="email">Email</option><option value="call">Call</option><option value="meeting">Meeting</option><option value="note">Note</option></Select></Field>
            <Field label="Direction"><Select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}><option value="outbound">Outbound</option><option value="inbound">Inbound</option></Select></Field>
          </div>
          <Field label="Content"><Textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Client asked about timeline and sounded worried..." /></Field>
          <div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit" loading={saving}>Save and analyze</Button></div>
        </form>
      </Modal>
    </div>
  );
}
