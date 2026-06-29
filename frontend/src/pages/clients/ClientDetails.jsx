import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ErrorBanner from "../../components/ui/ErrorBanner.jsx";
import { clientApi } from "../../api/clientApi.js";
import { projectApi } from "../../api/projectApi.js";
import { invoiceApi } from "../../api/invoiceApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import { toArray } from "../../utils/normalize.js";

export default function ClientDetails() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClientDetails() {
      try {
        setLoading(true);

        const [clientRes, projectsRes, invoicesRes] = await Promise.all([
          clientApi.getClient(id),
          projectApi.getProjects({ clientId: id }),
          invoiceApi.getInvoices({ clientId: id }),
        ]);

        setClient(clientRes?.client || clientRes?.data?.client || clientRes?.data || clientRes);
        setProjects(toArray(projectsRes?.docs ?? projectsRes?.projects ?? projectsRes));
        setInvoices(toArray(invoicesRes?.docs ?? invoicesRes?.invoices ?? invoicesRes));
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Could not load client details");
      } finally {
        setLoading(false);
      }
    }

    loadClientDetails();
  }, [id]);

  if (loading) return <Loader label="Loading client details" />;
  if (!client) return <ErrorBanner message={error || "Client not found"} />;

  const paidRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + (Number(invoice.total) || 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Client Details"
        title={client.name}
        description={client.company || client.email || "Client information"}
        actions={
          <Link to="/clients">
            <Button variant="secondary">Back to Clients</Button>
          </Link>
        }
      />

      <ErrorBanner message={error} />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-xl font-black text-ink">Client Profile</h2>

          <div className="mt-4 space-y-3 text-sm">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Company:</strong> {client.company || "No company"}</p>
            <p><strong>Email:</strong> {client.email || "No email"}</p>
            <p><strong>Phone:</strong> {client.phone || "No phone"}</p>
            <p><strong>Status:</strong> <Badge status={client.status}>{client.status}</Badge></p>
            <p><strong>Risk Score:</strong> {client.riskScore || 0}</p>
            <p><strong>Created:</strong> {formatDate(client.createdAt)}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-ink">Summary</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-soft p-4">
              <p className="text-sm text-muted">Projects</p>
              <p className="text-2xl font-black text-ink">{projects.length}</p>
            </div>

            <div className="rounded-2xl bg-soft p-4">
              <p className="text-sm text-muted">Invoices</p>
              <p className="text-2xl font-black text-ink">{invoices.length}</p>
            </div>

            <div className="rounded-2xl bg-soft p-4">
              <p className="text-sm text-muted">Paid Revenue</p>
              <p className="text-2xl font-black text-ink">{formatCurrency(paidRevenue)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black text-ink">Projects</h2>

          <div className="mt-4 space-y-3">
            {projects.length ? (
              projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block rounded-2xl bg-soft p-4 hover:bg-gray-100"
                >
                  <p className="font-black text-ink">{project.title}</p>
                  <p className="text-sm text-muted">Status: {project.status}</p>
                  <p className="text-sm text-muted">
                    Budget: {formatCurrency(project.budget, project.currency)}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">No projects found for this client.</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-ink">Invoices</h2>

          <div className="mt-4 space-y-3">
            {invoices.length ? (
              invoices.map((invoice) => (
                <Link
                  key={invoice._id}
                  to={`/invoices/${invoice._id}`}
                  className="block rounded-2xl bg-soft p-4 hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-ink">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted">Due {formatDate(invoice.dueDate)}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-ink">{formatCurrency(invoice.total)}</p>
                      <Badge status={invoice.status}>{invoice.status}</Badge>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">No invoices found for this client.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}