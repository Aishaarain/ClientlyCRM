import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../ui/Card.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function RevenueChart({ invoices = [] }) {
  const data = Object.values(invoices.reduce((acc, invoice) => {
    const date = invoice.createdAt ? new Date(invoice.createdAt) : new Date();
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = { month: key, revenue: 0 };
    if (invoice.status === 'paid') acc[key].revenue += Number(invoice.total) || 0;
    return acc;
  }, {})).sort((a, b) => a.month.localeCompare(b.month));

  const safeData = data.length ? data : [{ month: 'No data', revenue: 0 }];

  return (
    <Card className="h-96">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-ink">Paid revenue</h3>
          <p className="text-sm text-muted">Revenue grouped by invoice creation month</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="78%">
        <AreaChart data={safeData}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2D62ED" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#2D62ED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#707070" />
          <YAxis tick={{ fontSize: 12 }} stroke="#707070" tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Area type="monotone" dataKey="revenue" stroke="#2D62ED" strokeWidth={3} fill="url(#revenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
