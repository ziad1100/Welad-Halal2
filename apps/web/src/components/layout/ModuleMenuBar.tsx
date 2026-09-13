import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/authStore';
import { applyDir } from '../../lib/i18n';

export function ModuleMenuBar() {
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  const level = user?.permissionLevel ?? 10;
  const isStaff = level >= 50;
  function lang(l: string) {
    i18n.changeLanguage(l);
    applyDir(l);
  }
  return (
    <nav className="wh-header" style={{ background: '#3f5a32', flexWrap: 'wrap' }}>
      <Link to="/cashier" style={{ color: '#fff' }}>الكاشير</Link>
      {isStaff && <Link to="/orders" style={{ color: '#fff' }}>الطلبات</Link>}
      <Link to="/pending" style={{ color: '#fff' }}>المعلقة</Link>
      {isStaff && <Link to="/inventory" style={{ color: '#fff' }}>مخزن</Link>}
      {isStaff && <Link to="/purchases" style={{ color: '#fff' }}>المشتريات</Link>}
      {isStaff && <Link to="/suppliers" style={{ color: '#fff' }}>الموردين والعملاء</Link>}
      {isStaff && <Link to="/manufacturing" style={{ color: '#fff' }}>تصنيع</Link>}
      {isStaff && <Link to="/expenses" style={{ color: '#fff' }}>مصروفات</Link>}
      {isStaff && <Link to="/reports" style={{ color: '#fff' }}>تقارير العمل</Link>}
      {isStaff && <Link to="/hr" style={{ color: '#fff' }}>شئون العاملين</Link>}
      {isStaff && <Link to="/admin" style={{ color: '#fff' }}>الإدارة</Link>}
      <span style={{ flex: 1 }} />
      <button className="wh-btn" onClick={() => lang('ar')}>عربي</button>
      <button className="wh-btn" onClick={() => lang('en')}>EN</button>
      <span>{user?.username}</span>
      <button className="wh-btn" onClick={logout}>خروج</button>
    </nav>
  );
}
