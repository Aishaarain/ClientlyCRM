import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { isAdmin, booting } = useAuth();
  if (booting) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}