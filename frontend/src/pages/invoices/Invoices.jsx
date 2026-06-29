import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Table from '../../components/ui/Table.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import { invoiceApi } from '../../api/invoiceApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const STATUS_OPTIONS = ['draft', 'sent', 'paid', 'overdue'];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); // ✅ track status update
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { setInvoices(await invoiceApi.getInvoices()); }
    catch (err) { setError(err?.response?.data?.message || err.message || 'Could not load invoices'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ✅ Status change handler
  const handleStatusChange = async (row, newStatus) => {
    setUpdatingId(row._id);
    setError('');
    try {
      await invoiceApi.updateInvoiceStatus(row._id, newStatus);
      // update locally without full reload for snappy UX
      setInvoices((prev) => prev.map((inv) => inv._id === row._id ? { ...inv, status: newStatus } : inv));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete invoice "${row.invoiceNumber}"? This cannot be undone.`)) return;
    setDeletingId(row._id);
    setError('');
    try {
      await invoiceApi.deleteInvoice(row._id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not delete invoice');
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(() => [
    { key: 'invoiceNumber', header: 'Invoice',  render: (row) => <Link className="font-black text-primary hover:underline" to={`/invoices/${row._id}`}>{row.invoiceNumber}</Link> },
    { key: 'client',        header: 'Client',   render: (row) => row.clientId?.name || '—' },
    { key: 'total',         header: 'Total',    render: (row) => <span className="font-black">{formatCurrency(row.total)}</span> },
    { key: 'dueDate',       header: 'Due date', render: (row) => formatDate(row.dueDate) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <select
          value={row.status}
          disabled={updatingId === row._id}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => invoiceApi.downloadInvoicePdf(row._id, row.invoiceNumber)}
          >
            <Download size={15} /> PDF
          </Button>
          <Button
            size="sm"
            variant="danger"
            loading={deletingId === row._id}
            onClick={() => handleDelete(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ], [deletingId, updatingId]);

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Invoices"
        description="Create invoices, update payment status, and download clean PDF invoices."
        actions={<Link to="/invoices/create"><Button><Plus size={18}/> Create invoice</Button></Link>}
      />
      <ErrorBanner message={error} />
      {loading ? <Loader label="Loading invoices" /> : <Table columns={columns} data={invoices} emptyTitle="No invoices yet" />}
    </div>
  );
}