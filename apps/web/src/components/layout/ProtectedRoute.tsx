import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';

export function ProtectedRoute({ children, minLevel = 10 }: { children: ReactElement; minLevel?: number }) {
  const { token, user } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if ((user.permissionLevel ?? 0) < minLevel) return <Navigate to="/cashier" replace />;
  if (user.forcePasswordChange) return <Navigate to="/change-password" replace />;
  return children;
}
