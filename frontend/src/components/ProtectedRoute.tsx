import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="flex justify-center p-8 text-dark-400">Chargement...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}
