import clsx from 'clsx';
import { getStatusClass } from '../../utils/statusStyles.js';

export default function Badge({ children, status, className }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1', getStatusClass(status || children), className)}>
      {String(children || status || '').replace('_', ' ')}
    </span>
  );
}
