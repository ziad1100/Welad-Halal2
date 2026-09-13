import { useEffect, useState } from 'react';
import { listOrders } from '../../services/api/orders.api';

export function OrdersLogPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { listOrders().then(setOrders).catch(() => {}); }, []);
  return (
    <div style={{ padding: 8 }}>
      <h3>سجل الطلبات</h3>
      <table className="wh-table">
        <thead><tr><th>رقم</th><th>الحالة</th><th>النوع</th><th>الإجمالي</th><th>التاريخ</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={{ background: '#EDDDE7' }}>
              <td>{o.reference}</td><td>{o.status}</td><td>{o.type}</td>
              <td>{Number(o.total).toFixed(2)}</td><td>{new Date(o.createdAt).toLocaleString('ar-EG')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
