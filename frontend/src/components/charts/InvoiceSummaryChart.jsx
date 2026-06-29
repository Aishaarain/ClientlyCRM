import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const SLICES = [
  { key: 'paid',    label: 'Paid',    color: '#22c55e' },
  { key: 'unpaid',  label: 'Unpaid',  color: '#f59e0b' },
  { key: 'overdue', label: 'Overdue', color: '#ef4444' },
  { key: 'draft',   label: 'Draft',   color: '#94a3b8' },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, count } = payload[0].payload;
  return (
    <div className="rounded-2xl border border-line bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-muted">{name}</p>
      <p className="mt-1 text-lg font-black text-ink">{formatCurrency(value)}</p>
      <p className="text-xs text-muted">{count} invoice{count !== 1 ? 's' : ''}</p>
    </div>
  );
}

function CustomLegend({ data }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {data.map((item) => (
        <div key={item.key} className="flex items-center gap-2 rounded-2xl bg-soft px-3 py-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted">{item.label}</p>
            <p className="truncate text-sm font-black text-ink">{formatCurrency(item.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InvoiceSummaryChart({ invoices = [] }) {
  // Build data from invoices — use `total` field from your Invoice model
  const data = SLICES.map(({ key, label, color }) => {
    const matching = invoices.filter((inv) => inv.status === key);
    const value    = matching.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
    return { key, name: label, value, count: matching.length, color };
  }).filter((d) => d.value > 0 || d.count > 0);

  const totalAmount = data.reduce((sum, d) => sum + d.value, 0);
  const hasData     = data.some((d) => d.value > 0);

  return (
    <Card className="flex flex-col">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-black text-ink">Invoice summary</h3>
          <p className="text-sm text-muted">Breakdown by payment status</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-muted">Total billed</p>
          <p className="text-xl font-black text-ink">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm text-muted">No invoice data yet.</p>
        </div>
      ) : (
        <>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-bold text-muted">Total</p>
              <p className="text-lg font-black text-ink">{formatCurrency(totalAmount)}</p>
            </div>
          </div>

          <CustomLegend data={data} />
        </>
      )}
    </Card>
  );
}