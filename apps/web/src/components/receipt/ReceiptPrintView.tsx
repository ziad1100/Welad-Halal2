// 80mm thermal receipt — Arabic always, EGP only
export function ReceiptPrintView({ order, storePhone }: { order: any; storePhone?: string }) {
  if (!order) return null;
  const dt = new Date(order.createdAt).toLocaleString('ar-EG');
  const showDelivery = Number(order.deliveryFee ?? 0) > 0;
  return (
    <div style={{ width: '80mm', fontFamily: 'Tahoma', textAlign: 'center', direction: 'rtl' }}>
      <h2 style={{ margin: 0 }}>ولاد حلال</h2>
      {storePhone && <div>{storePhone}</div>}
      <div>--------------------------------</div>
      <div>طلب #{order.reference}</div>
      <div>{dt}</div>
      <div>--------------------------------</div>
      <div>العميل: {order.customer?.name ?? 'عميل'}</div>
      <div>الحالة: تم التأكيد</div>
      <div>--------------------------------</div>
      <div style={{ textAlign: 'right' }}>
        {(order.items ?? []).map((it: any) => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{it.qty}x {it.productName}</span>
            <span>{Number(it.lineTotal).toFixed(2)} EGP</span>
          </div>
        ))}
      </div>
      <div>--------------------------------</div>
      <div>المجموع الفرعي: {Number(order.subtotal).toFixed(2)} EGP</div>
      {showDelivery && <div>التوصيل: {Number(order.deliveryFee).toFixed(2)} EGP</div>}
      <div>================================</div>
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>الإجمالي: {Number(order.total).toFixed(2)} EGP</div>
      <div>الدفع: نقدي</div>
      <div>شكراً لتسوقك من ولاد حلال</div>
      <div>Thank you for shopping with Welad Halal!</div>
      <div>• • •</div>
    </div>
  );
}
