import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, DollarSign, CalendarDays,
  Users, Building2, Mail, Phone, FileText,
} from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';

import { projectApi } from '../../api/projectApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-4 text-base font-black text-ink">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl bg-soft p-5 text-center text-sm text-muted">
      {message}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <Icon className="text-primary" size={18} />
      <p className="mt-2 text-sm font-bold text-muted">{label}</p>
      <p className="font-black text-ink">{value}</p>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await projectApi.getProjectById(id);
        setProject(res.project);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader label="Loading project" />;

  if (error || !project) return (
    <div>
      <ErrorBanner message={error || 'Project not found'} />
      <Button variant="secondary" onClick={() => navigate('/projects')} className="mt-4">
        <ArrowLeft size={16} /> Back to projects
      </Button>
    </div>
  );

  const client = project.client;

  return (
    <div className="space-y-8">

      {/* Header */}
      <PageHeader
        eyebrow={
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={15} /> Projects
          </button>
        }
        title={project.title}
        description={project.description || 'No description added.'}
        actions={<Badge status={project.status}>{project.status}</Badge>}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={DollarSign} label="Budget" value={formatCurrency(project.budget || 0)} />
        <StatCard icon={CalendarDays} label="Deadline" value={formatDate(project.deadline)} />
        <StatCard icon={Users} label="Members" value={project.members?.length || 0} />
        <StatCard icon={FileText} label="Status" value={
          <Badge status={project.status}>{project.status}</Badge>
        } />
      </div>

      {/* Client + Members row */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* Client */}
        <Card>
          <Section title="Client">
            {client ? (
              <div className="rounded-2xl bg-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge status={client.status || 'active'}>{client.status || 'active'}</Badge>
                    <Link
                      to={`/clients/${client._id}`}
                      className="mt-2 block text-lg font-black text-ink hover:text-primary"
                    >
                      {client.name}
                    </Link>
                    {client.company && (
                      <p className="mt-0.5 text-sm font-semibold text-muted">{client.company}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p className="flex items-center gap-2"><Mail size={15} /> {client.email || 'No email'}</p>
                  <p className="flex items-center gap-2"><Phone size={15} /> {client.phone || 'No phone'}</p>
                  <p className="flex items-center gap-2"><Building2 size={15} /> {client.company || 'No company'}</p>
                </div>
              </div>
            ) : (
              <EmptyState message="No client linked to this project." />
            )}
          </Section>
        </Card>

        {/* Members */}
        <Card>
          <Section title="Assigned Members">
            {!project.members?.length ? (
              <EmptyState message="No members assigned to this project." />
            ) : (
              <div className="space-y-3">
                {project.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between rounded-2xl bg-soft px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-black text-ink">{member.name || 'Unnamed'}</p>
                      <p className="text-xs text-muted">{member.email}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary capitalize">
                      {member.role || 'member'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </Card>
      </div>

      {/* Created by */}
      {project.createdBy && (
        <Card>
          <Section title="Created By">
            <div className="flex items-center gap-3 rounded-2xl bg-soft px-4 py-3">
              <div>
                <p className="text-sm font-black text-ink">{project.createdBy.name}</p>
                <p className="text-xs text-muted">{project.createdBy.email}</p>
              </div>
              <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Admin
              </span>
            </div>
          </Section>
        </Card>
      )}

    </div>
  );
}