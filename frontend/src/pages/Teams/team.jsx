import { useEffect, useState } from 'react';
import { UserPlus, Mail } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import Loader from '../../components/ui/Loader.jsx';
import api from '../../api/axios.js';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
const [workspaceId, setWorkspaceId] = useState('');

  const load = async () => {
  setLoading(true);

  try {
    const workspaceRes = await api.get('/workspaces');

    const myWorkspace = workspaceRes.data?.[0];

    if (!myWorkspace) {
      setError('Please create a workspace first.');
      return;
    }

    setWorkspaceId(myWorkspace._id);

    const res = await api.get('/team/members');
    setMembers(res.data);
  } catch (err) {
    setError(err?.response?.data?.message || 'Could not load team members');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { load(); }, []);

 const sendInvite = async (e) => {
  e.preventDefault();

  if (!workspaceId) {
    setError('Workspace not found. Please create a workspace first.');
    return;
  }

  setSending(true);
  setError('');
  setSuccess('');

  try {
    await api.post(`/workspaces/${workspaceId}/invite`, {
      email,
    });

    setSuccess(`Invitation sent to ${email}`);
    setEmail('');

    setTimeout(() => {
      setModalOpen(false);
      setSuccess('');
    }, 2000);
  } catch (err) {
    console.log('Invite error:', err?.response?.data || err.message);
    setError(err?.response?.data?.message || 'Could not send invite');
  } finally {
    setSending(false);
  }
};

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Team"
        description="Manage your workspace members and invite freelancers."
        actions={
          <Button onClick={() => { setModalOpen(true); setError(''); setSuccess(''); }}>
            <UserPlus size={18} /> Invite freelancer
          </Button>
        }
      />
      <ErrorBanner message={error} />

      {loading ? <Loader label="Loading team" /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <Card key={member._id}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-black text-primary">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-ink">{member.name}</p>
                  <p className="text-sm text-muted">{member.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  member.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {member.role}
                </span>
                <span className={`text-xs font-bold ${
                  member.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {member.status}
                </span>
              </div>
            </Card>
          ))}
          {!members.length && (
            <Card>
              <p className="text-sm text-muted">No team members yet. Invite your first freelancer!</p>
            </Card>
          )}
        </div>
      )}

      <Modal open={modalOpen} title="Invite freelancer" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={sendInvite}>
          {error   && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
          {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-600">{success}</p>}
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-muted">
              Freelancer email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                required
                type="email"
                placeholder="sara@example.com"
                className="w-full rounded-xl border border-line py-3 pl-10 pr-4 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted">
            They will receive an email from Velora CRM. If they reply, the reply goes to your registered email.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={sending}>Send invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}