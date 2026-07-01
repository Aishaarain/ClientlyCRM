import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Building2, MapPin, Pencil, Trash2, Plus } from 'lucide-react';

import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input, { Field, Select, Textarea } from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';

import { clientApi } from '../../api/clientApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  status: 'active',
  notes: '',
};

function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error?.message || fallback;
}

function getClientsFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.clients)) return response.clients;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.docs)) return response.docs;
  return [];
}

function normalizeClient(client) {
  return {
    ...emptyForm,
    ...client,
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    address: client?.address || '',
    status: client?.status || 'active',
    notes: client?.notes || '',
  };
}

export default function Clients() {
  const { isAdmin } = useAuth();

  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingClient, setEditingClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pageDescription = useMemo(() => {
    if (isAdmin) return 'Create, edit, and manage clients in your Velora CRM workspace.';
    return 'Clients connected to projects assigned to you.';
  }, [isAdmin]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientApi.getClients();
      setClients(getClientsFromResponse(response));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load clients'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setForm(normalizeClient(client));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setError('Only admin can create or update clients.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        address: form.address.trim(),
        status: form.status,
        notes: form.notes.trim(),
      };

      if (editingClient?._id) {
        await clientApi.updateClient(editingClient._id, payload);
      } else {
        await clientApi.createClient(payload);
      }

      closeModal();
      await loadClients();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save client'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (clientId) => {
    if (!isAdmin) {
      setError('Only admin can delete clients.');
      return;
    }

    const confirmed = window.confirm('Delete this client? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setError('');
      await clientApi.deleteClient(clientId);
      await loadClients();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete client'));
    }
  };

  if (loading) return <Loader label="Loading clients" />;

  return (
    <div>
      <PageHeader
        eyebrow="Clients"
        title={isAdmin ? 'Clients' : 'Assigned Clients'}
        description={pageDescription}
        actions={ null
        }
      />

      <ErrorBanner message={error} />

      {!clients.length ? (
        <Card className="p-10 text-center">
          <h3 className="text-lg font-black text-ink">No clients found</h3>
          <p className="mt-2 text-sm text-muted">
            {isAdmin
              ? 'Create your first client to start managing projects.'
              : 'You will see client details here when you are assigned to a project.'}
          </p>
          {isAdmin ? (
            <Button onClick={openCreateModal} className="mt-5">
              <Plus size={18} /> Add client
            </Button>
          ) : null}
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <Card key={client._id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge status={client.status || 'active'}>{client.status || 'active'}</Badge>
                  <Link to={`/clients/${client._id}`} className="mt-3 block text-xl font-black text-ink hover:text-primary">
                    {client.name}
                  </Link>
                  {client.company ? <p className="mt-1 text-sm font-semibold text-muted">{client.company}</p> : null}
                </div>

                {isAdmin ? (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditModal(client)} className="!rounded-full !p-2">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(client._id)} className="!rounded-full !p-2">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 text-sm text-muted">
                <p className="flex items-center gap-2"><Mail size={16} /> {client.email || 'No email added'}</p>
                <p className="flex items-center gap-2"><Phone size={16} /> {client.phone || 'No phone added'}</p>
                <p className="flex items-center gap-2"><Building2 size={16} /> {client.company || 'No company added'}</p>
                {client.address ? <p className="flex items-center gap-2"><MapPin size={16} /> {client.address}</p> : null}
              </div>

              {client.notes ? (
                <div className="rounded-2xl bg-soft p-4 text-sm leading-6 text-muted">
                  {client.notes}
                </div>
              ) : null}

              <div className="mt-auto pt-2">
                <Link to={`/clients/${client._id}`}>
                  <Button variant="secondary" size="sm">View details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen && isAdmin}
        title={editingClient ? 'Edit client' : 'Add client'}
        onClose={closeModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Client name">
              <Input required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            </Field>

            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </Field>

            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </Field>

            <Field label="Company">
              <Input value={form.company} onChange={(e) => updateField('company', e.target.value)} />
            </Field>

            <Field label="Status">
              <Select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="at-risk">At-risk</option>
              </Select>
            </Field>

            <Field label="Address">
              <Input value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </Field>
          </div>

          <Field label="Notes">
            <Textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} />
          </Field>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingClient ? 'Update client' : 'Create client'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
