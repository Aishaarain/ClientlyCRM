import { useEffect, useState } from 'react';
import { Trash2, Plus, Flag } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Input, { Field, Select, Textarea } from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import Loader from '../components/ui/Loader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import { taskApi } from '../api/projectApi.js';
import { projectApi } from '../api/projectApi.js';
import api from '../api/axios.js';
import { formatDate } from '../utils/formatDate.js';
import { toArray } from '../utils/normalize.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  title: '',
  description: '',
  project: '',
  assignedTo: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

const priorityTone = { low: 'blue', medium: 'amber', high: 'pink' };
const statusTone   = { todo: 'slate', 'in-progress': 'blue', completed: 'green' };

export default function Tasks() {
   const { isAdmin } = useAuth();
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers]   = useState([]);
  const [form, setForm]         = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [tasksRes, projectsRes, membersRes] = await Promise.all([
        taskApi.getTasks(),
        projectApi.getProjects(),
        api.get('/team/members').then((r) => r.data),
      ]);
      setTasks(toArray(tasksRes.tasks ?? tasksRes));
      setProjects(toArray(projectsRes.projects ?? projectsRes));
      setMembers(toArray(membersRes.members ?? membersRes));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openModal = () => { setForm(emptyForm); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await taskApi.createTask({
        ...form,
        dueDate: form.dueDate || undefined,
      });
      closeModal();
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await taskApi.updateTaskStatus(id, status);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskApi.deleteTask(id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) return <Loader label="Loading tasks" />;

  return (
    <div>
     <PageHeader
  eyebrow="Task Management"
  title="Tasks"
  description="Create tasks, assign them to your freelancers, and track progress."
  actions={
    isAdmin ? (
      <Button onClick={openModal}>
        <Plus size={18} /> Add Task
      </Button>
    ) : null
  }
/>
      <ErrorBanner message={error} />

      {!tasks.length ? (
        <Card className="p-10 text-center">
          <h3 className="text-lg font-black text-ink">No tasks yet</h3>
          <p className="mt-2 text-sm text-muted">Create your first task and assign it to a freelancer.</p>
          <Button onClick={openModal} className="mt-5"><Plus size={18} /> New task</Button>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {tasks.map((task) => (
            <Card key={task._id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge status={task.status}>{task.status}</Badge>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold
                      ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'}`}>
                      <Flag size={12} /> {task.priority}
                    </span>
                  </div>
                  <p className="mt-2 font-black text-ink">{task.title}</p>
                  {task.description && (
                    <p className="mt-1 text-sm text-muted">{task.description}</p>
                  )}
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(task._id)}
                  className="!rounded-full !p-2 shrink-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="rounded-2xl bg-soft p-3 text-sm">
                <p className="text-muted">
                  <span className="font-black text-ink">Project: </span>
                  {task.project?.title || '—'}
                </p>
                <p className="mt-1 text-muted">
                  <span className="font-black text-ink">Assigned to: </span>
                  {task.assignedTo?.name || task.assignedTo?.email || '—'}
                </p>
                {task.dueDate && (
                  <p className="mt-1 text-muted">
                    <span className="font-black text-ink">Due: </span>
                    {formatDate(task.dueDate)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wide text-muted">Status:</span>
                <Select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="!py-1.5 !text-xs"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} title="Create task" onClose={closeModal}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Task title">
            <Input
              required
              placeholder="e.g. Design landing page"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project">
              <Select
                required
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </Select>
            </Field>

            <Field label="Assign to">
              <Select
                required
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              >
                <option value="">Select freelancer</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name} — {m.role}</option>
                ))}
              </Select>
            </Field>

            <Field label="Priority">
              <Select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Field>

            <Field label="Due date">
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              placeholder="Optional details about this task..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>Create task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
