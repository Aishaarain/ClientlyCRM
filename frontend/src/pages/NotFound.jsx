import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-soft p-6 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-3 text-5xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-muted">The page you are looking for does not exist.</p>
        <Link to="/dashboard"><Button className="mt-6">Go dashboard</Button></Link>
      </div>
    </div>
  );
}
