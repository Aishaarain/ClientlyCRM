import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { Field, Select } from '../../components/ui/Input.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import AIResultCard from './AIResultCard.jsx';
import { clientApi } from '../../api/clientApi.js';
import { projectApi } from '../../api/projectApi.js';
import { aiApi } from '../../api/aiApi.js';
import { toArray } from '../../utils/normalize.js';

export default function ProposalGenerator() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ clientId: '', projectId: '' });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    clientApi.getClients({ limit: 100 }).then((res) => setClients(toArray(res.clients ?? res.data ?? res))).catch(() => {})
  }, []);

  useEffect(() => {
    if (form.clientId) {
      projectApi.getProjects({ clientId: form.clientId })
        .then((res) => setProjects(toArray(res.projects ?? res.docs ?? res.data ?? res)))
        .catch(() => setProjects([]));
    } else {
      setProjects([]);
    }
  }, [form.clientId]);

  const generate = async (e) => {
    e.preventDefault(); setOutput(''); setError(''); setLoading(true);
    try { await aiApi.generateProposal(form, (_, full) => setOutput(full)); }
    catch (err) { setError(err.message || 'Could not generate proposal'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="AI Studio" title="Proposal generator" description="Generate professional proposals using selected client and project details from your CRM." />
      <ErrorBanner message={error} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <form className="space-y-4" onSubmit={generate}>
            <Field label="Client">
              <Select required value={form.clientId} onChange={(e) => setForm({ clientId: e.target.value, projectId: '' })}>
                <option value="">Select client</option>
                {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Project">
              <Select required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                <option value="">Select project</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
              </Select>
            </Field>
            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Generate proposal
            </Button>
          </form>
        </Card>
        <AIResultCard title="Proposal draft" text={output} />
      </div>
    </div>
  );
}