import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · Cliently` : 'Cliently';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
