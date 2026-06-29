import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import { invoiceApi } from '../../api/invoiceApi.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export default function InvoiceDetails() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    invoiceApi.getInvoices().then((items) => setInvoice(items.find((i) => i._id === id))).catch((err) => setError(err?.response?.data?.message || err.message)).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    const updated = await invoiceApi.updateInvoiceStatus(id, status);
    setInvoice(updated);
  };

  if (loading) return <Loader label="Loading invoice" />;
  if (!invoice) return <ErrorBanner message={error || 'Invoice not found. Add GET /api/v1/invoices/:id on backend for direct details.'} />;

  return (
    <div>
      <PageHeader eyebrow="Invoice" title={invoice.invoiceNumber} description={`Client: ${invoice.clientId?.name || '—'}`} actions={<><Link to="/invoices"><Button variant="secondary">Back</Button></Link><Button onClick={() => invoiceApi.downloadInvoicePdf(invoice._id, invoice.invoiceNumber)}><Download size={18}/> Download PDF</Button></>} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <div className="flex items-center justify-between"><h2 className="text-xl font-black text-ink">Line items</h2><Badge status={invoice.status}>{invoice.status}</Badge></div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-line">
              <thead><tr className="text-left text-xs font-black uppercase text-muted"><th className="py-3">Description</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
              <tbody className="divide-y divide-line">
                {invoice.lineItems?.map((item, index) => <tr key={index}><td className="py-4 font-semibold">{item.description}</td><td>{item.quantity}</td><td>{formatCurrency(item.rate)}</td><td className="font-black">{formatCurrency(item.total)}</td></tr>)}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-black text-ink">Summary</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Due date</span><span className="font-black">{formatDate(invoice.dueDate)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-black">{formatCurrency(invoice.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Tax</span><span className="font-black">{formatCurrency(invoice.tax)}</span></div>
            <div className="border-t border-line pt-3 flex justify-between text-lg"><span className="font-black">Total</span><span className="font-black text-primary">{formatCurrency(invoice.total)}</span></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {['draft','sent','paid','overdue'].map((status) => <Button key={status} variant={status === invoice.status ? 'primary' : 'secondary'} size="sm" onClick={() => updateStatus(status)}>{status}</Button>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
