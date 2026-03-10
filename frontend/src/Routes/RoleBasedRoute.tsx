import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  allowedRoles: ('BUYER' | 'SELLER' | 'ADMIN')[];
}

const RoleBasedRoute = ({ allowedRoles }: Props) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.includes(user.role as any)) {
    return <Navigate to="/" replace />; // Redirect unauthorized users to home
  }

  return <Outlet />;
};

export default RoleBasedRoute;