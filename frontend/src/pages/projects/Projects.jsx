import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, DollarSign, Pencil, Plus, Trash2, Users } from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input, { Field, Select, Textarea } from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';

import api from '../../api/axios.js';
import { clientApi } from '../../api/clientApi.js';
import { projectApi } from '../../api/projectApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const emptyForm = {
  title: '',
  description: '',
  client: '',
  members: [],
  status: 'pending',
  deadline: '',
  budget: '',
};

function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error?.message || fallback;
}

function getListFromResponse(response, key) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.[key])) return response[key];
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.docs)) return response.docs;
  return [];
}

function getClient(project) {
  return project?.client || project?.clientId || null;
}

function getProjectId(value) {
  return value?._id || value?.id || value;
}

function normalizeProject(project) {
  const client = getClient(project);

  return {
    ...emptyForm,
    title: project?.title || '',
    description: project?.description || '',
    client: getProjectId(client) || '',
    members: Array.isArray(project?.members)
      ? project.members.map((member) => getProjectId(member)).filter(Boolean)
      : [],
    status: project?.status || 'pending',
    deadline: project?.deadline?.slice?.(0, 10) || project?.endDate?.slice?.(0, 10) || '',
    budget: project?.budget ?? '',
  };
}

export default function Projects() {
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProject, setEditingProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pageDescription = useMemo(() => {
    if (isAdmin) return 'Create projects, assign freelancers/members, and connect each project with a client.';
    return 'Projects assigned to you by your admin, including related client details.';
  }, [isAdmin]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectApi.getProjects();
      setProjects(getListFromResponse(response, 'projects'));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load projects'));
    } finally {
      setLoading(false);
    }
  };

  const loadAdminFormData = async () => {
    if (!isAdmin) return;

    try {
      const [clientsResponse, membersResponse] = await Promise.all([
        clientApi.getClients(),
        api.get('/team/members').then((res) => res.data),
      ]);

      setClients(getListFromResponse(clientsResponse, 'clients'));
      setMembers(getListFromResponse(membersResponse, 'members'));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load clients or team members'));
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadAdminFormData();
  }, [isAdmin]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMembers = (event) => {
    const selectedMembers = Array.from(event.target.selectedOptions).map((option) => option.value);
    updateField('members', selectedMembers);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm(normalizeProject(project));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setError('Only admin can create or update projects.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        client: form.client,
        members: form.members,
        status: form.status,
        deadline: form.deadline || undefined,
        budget: Number(form.budget) || 0,
      };

      if (editingProject?._id) {
        await projectApi.updateProject(editingProject._id, payload);
      } else {
        await projectApi.createProject(payload);
      }

      closeModal();
      await loadProjects();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save project'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!isAdmin) {
      setError('Only admin can delete projects.');
      return;
    }

    const confirmed = window.confirm('Delete this project? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setError('');
      await projectApi.deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete project'));
    }
  };

  if (loading) return <Loader label="Loading projects" />;

  return (
    <div>
      

      <ErrorBanner message={error} />

      {!projects.length ? (
        <Card className="p-10 text-center">
          <h3 className="text-lg font-black text-ink">No projects found</h3>
          <p className="mt-2 text-sm text-muted">
            {isAdmin
              ? 'Create your first project and assign team members.'
              : 'You will see projects here when your admin assigns them to you.'}
          </p>
          {isAdmin ? (
            <Button onClick={openCreateModal} className="mt-5">
              <Plus size={18} /> Add project
            </Button>
          ) : null}
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => {
            const client = getClient(project);
            const deadline = project.deadline || project.endDate;

            return (
              <Card key={project._id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge status={project.status || 'pending'}>{project.status || 'pending'}</Badge>
                    <Link to={`/projects/${project._id}`} className="mt-3 block text-xl font-black text-ink hover:text-primary">
                      {project.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{project.description || 'No description added.'}</p>
                  </div>

                  {isAdmin ? (
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEditModal(project)} className="!rounded-full !p-2">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(project._id)} className="!rounded-full !p-2">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-soft p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-muted">Client</p>
                  {client ? (
                    <div className="mt-2">
                      <p className="font-black text-ink">{client.name || 'Unnamed client'}</p>
                      <p className="text-sm text-muted">{client.email || 'No email'} {client.phone ? `• ${client.phone}` : ''}</p>
                      {client.company ? <p className="text-sm text-muted">{client.company}</p> : null}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No client assigned.</p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-line bg-white p-4">
                    <DollarSign className="text-primary" size={18} />
                    <p className="mt-2 text-sm font-bold text-muted">Budget</p>
                    <p className="font-black text-ink">{formatCurrency(project.budget || 0, project.currency || 'USD')}</p>
                  </div>

                  <div className="rounded-2xl border border-line bg-white p-4">
                    <CalendarDays className="text-primary" size={18} />
                    <p className="mt-2 text-sm font-bold text-muted">Deadline</p>
                    <p className="font-black text-ink">{formatDate(deadline)}</p>
                  </div>

                  <div className="rounded-2xl border border-line bg-white p-4">
                    <Users className="text-primary" size={18} />
                    <p className="mt-2 text-sm font-bold text-muted">Members</p>
                    <p className="font-black text-ink">{project.members?.length || 0}</p>
                  </div>
                </div>

                {project.members?.length ? (
                  <div>
                    <p className="text-sm font-black text-ink">Assigned members</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.members.map((member) => (
                        <span key={member._id || member} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {member.name || member.email || 'Member'}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-auto pt-2">
                  <Link to={`/projects/${project._id}`}>
                    <Button variant="secondary" size="sm">View details</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen && isAdmin}
        title={editingProject ? 'Edit project' : 'Add project'}
        onClose={closeModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project title">
              <Input required value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </Field>

            <Field label="Client">
              <Select required value={form.client} onChange={(e) => updateField('client', e.target.value)}>
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>{client.name}</option>
                ))}
              </Select>
            </Field>

            <Field label="Status">
              <Select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Field>

            <Field label="Deadline">
              <Input type="date" value={form.deadline} onChange={(e) => updateField('deadline', e.target.value)} />
            </Field>

            <Field label="Budget">
              <Input type="number" min="0" value={form.budget} onChange={(e) => updateField('budget', e.target.value)} />
            </Field>

            <Field label="Assign members" hint="Hold Ctrl on Windows to select multiple members.">
              <Select multiple value={form.members} onChange={updateMembers} className="min-h-32">
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} — {member.role || 'member'}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} />
          </Field>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingProject ? 'Update project' : 'Create project'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
