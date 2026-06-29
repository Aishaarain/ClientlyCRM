// import { useEffect, useMemo, useState } from 'react';
// import { Bot, BriefcaseBusiness, Receipt, ShieldAlert, Users } from 'lucide-react';
// import PageHeader from '../../components/ui/PageHeader.jsx';
// import StatCard from '../../components/ui/StatCard.jsx';
// import Loader from '../../components/ui/Loader.jsx';
// import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
// import Card from '../../components/ui/Card.jsx';
// import Badge from '../../components/ui/Badge.jsx';
// import RevenueChart from '../../components/charts/RevenueChart.jsx';
// import ClientStatusChart from '../../components/charts/ClientStatusChart.jsx';
// import { clientApi } from '../../api/clientApi.js';
// import { projectApi } from '../../api/projectApi.js';
// import { invoiceApi } from '../../api/invoiceApi.js';
// import { aiApi } from '../../api/aiApi.js';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { toArray } from '../../utils/normalize.js';
// import { formatCurrency } from '../../utils/formatCurrency.js';
// import { formatDate } from '../../utils/formatDate.js';

// export default function Dashboard() {
//   const { user, isAdmin } = useAuth(); // ✅
//   const [state, setState] = useState({ clients: [], projects: [], invoices: [], content: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       try {
//         setLoading(true);
//         const [clientsRes, projectsRes, invoicesRes, contentRes] = await Promise.all([
//           clientApi.getClients({ limit: 100 }),
//           projectApi.getProjects(),
//           invoiceApi.getInvoices(),
//           aiApi.getAIContent(),
//         ]);
//         if (!mounted) return;
//         setState({
//           clients:  toArray(clientsRes),
//           projects: toArray(projectsRes.docs ?? projectsRes), // ✅ fix paginated response
//           invoices: toArray(invoicesRes),
//           content:  toArray(contentRes),
//         });
//       } catch (err) {
//         setError(err?.response?.data?.message || err.message || 'Could not load dashboard');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//     load();
//     return () => { mounted = false; };
//   }, []);

//   const stats = useMemo(() => {
//     const paidRevenue = state.invoices
//       .filter((i) => i.status === 'paid')
//       .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
//     return {
//       clients:         state.clients.length,
//       activeProjects:  state.projects.filter((p) => p.status === 'active').length,
//       paidRevenue,
//       overdueInvoices: state.invoices.filter((i) => i.status === 'overdue').length,
//       atRisk:          state.clients.filter((c) => c.status === 'at-risk').length,
//       aiContent:       state.content.length,
//     };
//   }, [state]);

//   if (loading) return <Loader label="Loading dashboard" />;

//   return (
//     <div>
//       <PageHeader
//         eyebrow={isAdmin ? '👑 Admin Dashboard' : '👨‍💻 Freelancer Dashboard'} // ✅
//         title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}!`}        // ✅ personalised
//         description="Track clients, revenue, projects, AI content, overdue invoices, and risk signals from one Velora dashboard."
//       />
//       <ErrorBanner message={error} />

//       <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
//         <StatCard label="Total clients"      value={stats.clients}         icon={Users}           tone="blue" />
//         <StatCard label="Active projects"    value={stats.activeProjects}  icon={BriefcaseBusiness} tone="green" />
//         <StatCard label="Paid revenue"       value={formatCurrency(stats.paidRevenue)} icon={Receipt} tone="slate" />
//         <StatCard label="Overdue invoices"   value={stats.overdueInvoices} icon={Receipt}         tone="amber" />
//         <StatCard label="At-risk clients"    value={stats.atRisk}          icon={ShieldAlert}     tone="pink" />
//         <StatCard label="AI drafts"          value={stats.aiContent}       icon={Bot}             tone="blue" />
//       </div>

//       <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
//         <RevenueChart invoices={state.invoices} />
//         <ClientStatusChart clients={state.clients} />
//       </div>

//       <div className="mt-6 grid gap-6 xl:grid-cols-2">
//         <Card>
//           <h3 className="text-lg font-black text-ink">Recent at-risk clients</h3>
//           <div className="mt-4 space-y-3">
//             {state.clients.filter((c) => c.status === 'at-risk').slice(0, 5).map((client) => (
//               <div key={client._id} className="flex items-center justify-between rounded-2xl bg-soft p-4">
//                 <div>
//                   <p className="font-black text-ink">{client.name}</p>
//                   <p className="text-sm text-muted">{client.company || client.email}</p>
//                 </div>
//                 <Badge status="at-risk">Risk {client.riskScore || 0}</Badge>
//               </div>
//             ))}
//             {!state.clients.filter((c) => c.status === 'at-risk').length
//               ? <p className="text-sm text-muted">No at-risk clients right now.</p>
//               : null}
//           </div>
//         </Card>

//         <Card>
//           <h3 className="text-lg font-black text-ink">Latest invoices</h3>
//           <div className="mt-4 space-y-3">
//             {state.invoices.slice(0, 5).map((invoice) => (
//               <div key={invoice._id} className="flex items-center justify-between rounded-2xl bg-soft p-4">
//                 <div>
//                   <p className="font-black text-ink">{invoice.invoiceNumber}</p>
//                   <p className="text-sm text-muted">Due {formatDate(invoice.dueDate)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-black text-ink">{formatCurrency(invoice.total)}</p>
//                   <Badge status={invoice.status}>{invoice.status}</Badge>
//                 </div>
//               </div>
//             ))}
//             {!state.invoices.length
//               ? <p className="text-sm text-muted">No invoices created yet.</p>
//               : null}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Bot, BriefcaseBusiness, CheckSquare, Receipt, ShieldAlert, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import RevenueChart from '../../components/charts/RevenueChart.jsx';
import InvoiceSummary from '../../components/charts/InvoiceSummaryChart.jsx'
import { clientApi } from '../../api/clientApi.js';
import { projectApi } from '../../api/projectApi.js';
import { invoiceApi } from '../../api/invoiceApi.js';
import { aiApi } from '../../api/aiApi.js';
import { taskApi } from '../../api/projectApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { toArray } from '../../utils/normalize.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const priorityColor = {
  high:   'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-600',
  low:    'bg-blue-50 text-blue-600',
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [state, setState] = useState({ clients: [], projects: [], invoices: [], content: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);

        if (isAdmin) {
          const [clientsRes, projectsRes, invoicesRes, contentRes] = await Promise.all([
            clientApi.getClients({ limit: 100 }),
            projectApi.getProjects(),
            invoiceApi.getInvoices(),
            aiApi.getAIContent(),
          ]);
          if (!mounted) return;
          setState({
            clients:  toArray(clientsRes),
            projects: toArray(projectsRes.docs ?? projectsRes),
            invoices: toArray(invoicesRes),
            content:  toArray(contentRes),
            tasks:    [],
          });
        } else {
          const [projectsRes, tasksRes] = await Promise.all([
            projectApi.getProjects(),
            taskApi.getTasks(),
          ]);
          if (!mounted) return;
          setState({
            clients:  [],
            projects: toArray(projectsRes.docs ?? projectsRes),
            invoices: [],
            content:  [],
            tasks:    toArray(tasksRes.tasks ?? tasksRes),
          });
        }
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || err.message || 'Could not load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [isAdmin]);

  const handleStatusChange = async (id, status) => {
    try {
      await taskApi.updateTaskStatus(id, status);
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => t._id === id ? { ...t, status } : t),
      }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update task');
    }
  };

  const stats = useMemo(() => {
    const paidRevenue = state.invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    return {
      clients:          state.clients.length,
      activeProjects:   state.projects.filter((p) => ['active', 'in-progress'].includes(p.status)).length,
      totalProjects:    state.projects.length,
      completedProjects:state.projects.filter((p) => p.status === 'completed').length,
      paidRevenue,
      overdueInvoices:  state.invoices.filter((i) => i.status === 'overdue').length,
      atRisk:           state.clients.filter((c) => c.status === 'at-risk').length,
      aiContent:        state.content.length,
      todoTasks:        state.tasks.filter((t) => t.status === 'todo').length,
      inProgressTasks:  state.tasks.filter((t) => t.status === 'in-progress').length,
      completedTasks:   state.tasks.filter((t) => t.status === 'completed').length,
    };
  }, [state]);

  if (loading) return <Loader label="Loading dashboard" />;

  // ── Freelancer Dashboard ──────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div>
        <PageHeader
          eyebrow="👨‍💻 Freelancer Dashboard"
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}!`}
          description="Your assigned projects and tasks at a glance."
        />
        <ErrorBanner message={error} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total projects"  value={stats.totalProjects}  icon={BriefcaseBusiness} tone="blue" />
          <StatCard label="Active projects" value={stats.activeProjects} icon={BriefcaseBusiness} tone="green" />
          <StatCard label="Tasks to do"     value={stats.todoTasks}      icon={CheckSquare}       tone="amber" />
          <StatCard label="Tasks completed" value={stats.completedTasks} icon={CheckSquare}       tone="slate" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* Tasks */}
          <Card>
            <h3 className="text-lg font-black text-ink">Your tasks</h3>
            <div className="mt-4 space-y-3">
              {state.tasks.length ? state.tasks.map((task) => (
                <div key={task._id} className="rounded-2xl bg-soft p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge status={task.status}>{task.status}</Badge>
                        {task.priority && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${priorityColor[task.priority]}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-black text-ink">{task.title}</p>
                      {task.project?.title && (
                        <p className="mt-0.5 text-sm text-muted">Project: {task.project.title}</p>
                      )}
                      {task.dueDate && (
                        <p className="mt-0.5 text-sm text-muted">Due: {formatDate(task.dueDate)}</p>
                      )}
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted">No tasks assigned to you yet.</p>
              )}
            </div>
          </Card>

          {/* Projects */}
          <Card>
            <h3 className="text-lg font-black text-ink">Your projects</h3>
            <div className="mt-4 space-y-3">
              {state.projects.length ? state.projects.map((project) => (
                <div key={project._id} className="flex items-center justify-between rounded-2xl bg-soft p-4">
                  <div>
                    <p className="font-black text-ink">{project.title}</p>
                    <p className="text-sm text-muted">
                      {project.client?.name || 'No client'}
                      {project.deadline ? ` • Due ${formatDate(project.deadline)}` : ''}
                    </p>
                  </div>
                  <Badge status={project.status}>{project.status}</Badge>
                </div>
              )) : (
                <p className="text-sm text-muted">No projects assigned yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        eyebrow="👑 Admin Dashboard"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}!`}
        description="Track clients, revenue, projects, AI content, overdue invoices, and risk signals from one Velora dashboard."
      />
      <ErrorBanner message={error} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Total clients"    value={stats.clients}                     icon={Users}             tone="blue" />
        <StatCard label="Active projects"  value={stats.activeProjects}              icon={BriefcaseBusiness} tone="green" />
        <StatCard label="Paid revenue"     value={formatCurrency(stats.paidRevenue)} icon={Receipt}           tone="slate" />
        <StatCard label="Overdue invoices" value={stats.overdueInvoices}             icon={Receipt}           tone="amber" />
        <StatCard label="At-risk clients"  value={stats.atRisk}                      icon={ShieldAlert}       tone="pink" />
        <StatCard label="AI drafts"        value={stats.aiContent}                   icon={Bot}               tone="blue" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <RevenueChart invoices={state.invoices} />
        <InvoiceSummary invoices={state.invoices} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-black text-ink">Recent at-risk clients</h3>
          <div className="mt-4 space-y-3">
            {state.clients.filter((c) => c.status === 'at-risk').slice(0, 5).map((client) => (
              <div key={client._id} className="flex items-center justify-between rounded-2xl bg-soft p-4">
                <div>
                  <p className="font-black text-ink">{client.name}</p>
                  <p className="text-sm text-muted">{client.company || client.email}</p>
                </div>
                <Badge status="at-risk">Risk {client.riskScore || 0}</Badge>
              </div>
            ))}
            {!state.clients.filter((c) => c.status === 'at-risk').length && (
              <p className="text-sm text-muted">No at-risk clients right now.</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-black text-ink">Latest invoices</h3>
          <div className="mt-4 space-y-3">
            {state.invoices.slice(0, 5).map((invoice) => (
              <div key={invoice._id} className="flex items-center justify-between rounded-2xl bg-soft p-4">
                <div>
                  <p className="font-black text-ink">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-muted">Due {formatDate(invoice.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-ink">{formatCurrency(invoice.total)}</p>
                  <Badge status={invoice.status}>{invoice.status}</Badge>
                </div>
              </div>
            ))}
            {!state.invoices.length && (
              <p className="text-sm text-muted">No invoices created yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}