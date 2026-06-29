export const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
  'at-risk': 'bg-rose-50 text-rose-700 ring-rose-100',
  lead: 'bg-blue-50 text-blue-700 ring-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  paused: 'bg-amber-50 text-amber-700 ring-amber-100',
  draft: 'bg-slate-100 text-slate-600 ring-slate-200',
  sent: 'bg-blue-50 text-blue-700 ring-blue-100',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  overdue: 'bg-rose-50 text-rose-700 ring-rose-100',
  positive: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  risk: 'bg-rose-50 text-rose-700 ring-rose-100',
  proposal: 'bg-purple-50 text-purple-700 ring-purple-100',
  follow_up: 'bg-pink-50 text-pink-700 ring-pink-100',
  insight: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
};

export function getStatusClass(status) {
  return statusStyles[status] || 'bg-slate-100 text-slate-600 ring-slate-200';
}
