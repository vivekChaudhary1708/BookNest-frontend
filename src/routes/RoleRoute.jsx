import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

const RoleRoute = ({ children, role }) => {
  const user = useSelector(selectUser);
  const expectedRole = (role || '').toUpperCase();
  const actualRole = (user?.role || '').toUpperCase();

  if (!user) return <Navigate to="/login" replace />;
  if (actualRole !== expectedRole) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default RoleRoute;
