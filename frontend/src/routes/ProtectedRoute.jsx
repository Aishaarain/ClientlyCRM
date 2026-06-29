import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/ui/Loader.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  if (booting) return <Loader fullScreen label="Preparing your workspace" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
