import Card from './Card.jsx';
import EmptyState from './EmptyState.jsx';

export default function Table({ columns, data = [], emptyTitle = 'No data found', emptyDescription = 'Create your first record to see it here.' }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-slate-50/70">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-muted">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {data.length ? data.map((row, rowIndex) => (
              <tr key={row._id || row.id || rowIndex} className="transition hover:bg-soft/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-sm text-ink">
                    {column.render ? column.render(row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
      {!data.length ? (
        <div className="p-10">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : null}
    </Card>
  );
}
