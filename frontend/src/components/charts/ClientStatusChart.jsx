import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card.jsx';

const colors = {
  active: '#10B981',
  inactive: '#94A3B8',
  'at-risk': '#FF007C',
};

export default function ClientStatusChart({ clients = [] }) {
  const data = ['active', 'inactive', 'at-risk'].map((status) => ({
    name: status,
    value: clients.filter((client) => client.status === status).length,
  })).filter((item) => item.value > 0);

  const safeData = data.length ? data : [{ name: 'No clients', value: 1 }];

  return (
    <Card className="h-96">
      <h3 className="text-lg font-black text-ink">Client health</h3>
      <p className="text-sm text-muted">Status distribution across your CRM</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={safeData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={94} paddingAngle={4}>
              {safeData.map((entry) => <Cell key={entry.name} fill={colors[entry.name] || '#CBD5E1'} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3">
        {safeData.map((item) => (
          <span key={item.name} className="inline-flex items-center gap-2 text-xs font-bold capitalize text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[item.name] || '#CBD5E1' }} />
            {item.name.replace('-', ' ')}: {item.value}
          </span>
        ))}
      </div>
    </Card>
  );
}
