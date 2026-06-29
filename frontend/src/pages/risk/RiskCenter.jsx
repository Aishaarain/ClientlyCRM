import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import ProgressRing from '../../components/ui/ProgressRing.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import { clientApi } from '../../api/clientApi.js';
import { toArray } from '../../utils/normalize.js';

export default function RiskCenter() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { clientApi.getClients({ status: 'at-risk', limit: 100 }).then((res) => setClients(toArray(res))).catch((err) => setError(err?.response?.data?.message || err.message)).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <PageHeader eyebrow="Retention" title="Risk Center" description="Focus on clients that need attention because of risk sentiment, inactivity, or overdue invoices." />
      <ErrorBanner message={error} />
      {loading ? <Loader label="Loading risk center" /> : <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{clients.map((client) => <Card key={client._id}><div className="flex items-start justify-between"><div><Badge status="at-risk">At-risk</Badge><h3 className="mt-3 text-xl font-black text-ink">{client.name}</h3><p className="text-sm text-muted">{client.company || client.email}</p></div><ProgressRing value={client.riskScore || 0} label="Risk" /></div><p className="mt-4 text-sm leading-6 text-muted">{client.notes || 'Review recent interactions and invoices to decide the next recovery action.'}</p><div className="mt-5 flex gap-3"><Link to={`/clients/${client._id}`}><Button size="sm">Open profile</Button></Link><Link to="/ai/follow-up"><Button size="sm" variant="secondary">Draft follow-up</Button></Link></div></Card>)}{!clients.length ? <Card><p className="text-sm text-muted">No at-risk clients currently. Great job.</p></Card> : null}</div>}
    </div>
  );
}
