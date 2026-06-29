import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.6rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/90 px-6 py-4 backdrop-blur">
          <h2 className="text-lg font-black text-ink">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="!rounded-full !p-2">
            <X size={18} />
          </Button>
        </div>
        <div className="p-6">{children}</div>
        {footer ? <div className="border-t border-line px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
