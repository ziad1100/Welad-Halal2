import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';

export function ModuleMenuBar() {
  const { user, logout } = useAuth();
  const level = user?.permissionLevel ?? 10;
  const isStaff = level >= 50;
  return (
    <nav className="wh-header" style={{ background: '#3f5a32' }}>
      <Link to="/cashier" style={{ color: '#fff' }}>الكاشير</Link>
      {isStaff && <Link to="/orders" style={{ color: '#fff' }}>الطلبات</Link>}
      {isStaff && <Link to="/pending" style={{ color: '#fff' }}>المعلقة</Link>}
      {isStaff && <Link to="/admin" style={{ color: '#fff' }}>الإدارة</Link>}
      <span style={{ flex: 1 }} />
      <span>{user?.username}</span>
      <button className="wh-btn" onClick={logout}>خروج</button>
    </nav>
  );
}
