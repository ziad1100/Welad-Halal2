import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './lib/i18n';
import { LoginPage } from './pages/login/LoginPage';
import { CashierPage } from './pages/cashier/CashierPage';
import { OrdersLogPage } from './pages/orders/OrdersLogPage';
import { PendingOrdersPage } from './pages/orders/PendingOrdersPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ModuleMenuBar } from './components/layout/ModuleMenuBar';
import { BrandingHeader } from './components/layout/BrandingHeader';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <BrandingHeader />
      <ModuleMenuBar />
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cashier" element={<ProtectedRoute minLevel={10}><Shell><CashierPage /></Shell></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute minLevel={50}><Shell><OrdersLogPage /></Shell></ProtectedRoute>} />
        <Route path="/pending" element={<ProtectedRoute minLevel={10}><Shell><PendingOrdersPage /></Shell></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute minLevel={50}><Shell><div style={{ padding: 16 }}>الإدارة — إدارة المستخدمين (قريباً: CRUD كامل)</div></Shell></ProtectedRoute>} />
        <Route path="/change-password" element={<div style={{ padding: 16 }}>يرجى تغيير كلمة المرور (شاشة قريباً)</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
