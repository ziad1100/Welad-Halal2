import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PurchasesService } from '../src/modules/purchases/purchases.service';
import { OrdersService } from '../src/modules/orders/orders.service';

// DB integration: skipped in CI without a database. Locally runs against Docker Postgres.
// Host-side runs must map Docker hostnames (postgres/redis) to localhost.
if (process.env.DATABASE_URL?.includes('@postgres:')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('@postgres:', '@localhost:');
}
const DB = process.env.DATABASE_URL;
const run = DB ? describe : describe.skip;

run('inventory ledger (Postgres)', () => {
  const prisma = new PrismaClient();
  const purchases = new PurchasesService(prisma as any);
  const orders = new OrdersService(prisma as any);
  let supplierId = '';
  let productId = '';
  let branchId = 'branch-main';
  let ownerId = '';

  beforeAll(async () => {
    const owner = await prisma.user.findFirst({ where: { isOwner: true } });
    ownerId = owner!.id;
    const sup = await prisma.party.create({ data: { type: 'supplier', name: 'TEST-Spec Supplier' } });
    supplierId = sup.id;
    const cat = await prisma.category.findFirst();
    const p = await prisma.product.create({ data: { name: 'TEST-Spec Item', barcode: 'TESTSPEC001', basePrice: 50, categoryId: cat!.id } });
    productId = p.id;
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({ where: { product: { barcode: 'TESTSPEC001' } } });
    await prisma.order.deleteMany({ where: { items: { none: {} }, reference: { startsWith: 'WH-' } } });
    await prisma.stockMovement.deleteMany({ where: { product: { barcode: 'TESTSPEC001' } } });
    await prisma.inventory.deleteMany({ where: { product: { barcode: 'TESTSPEC001' } } });
    await prisma.purchaseItem.deleteMany({ where: { product: { barcode: 'TESTSPEC001' } } });
    await prisma.purchase.deleteMany({ where: { supplierId } });
    await prisma.product.deleteMany({ where: { barcode: 'TESTSPEC001' } });
    await prisma.party.deleteMany({ where: { id: supplierId } });
    await prisma.$disconnect();
  });

  it('purchase receive increases stock with average cost', async () => {
    const p1 = await purchases.create(ownerId, { supplierId, branchId, items: [{ productId, qty: 50, unitCost: 20 }] });
    await purchases.receive(ownerId, p1.id);
    const p2 = await purchases.create(ownerId, { supplierId, branchId, items: [{ productId, qty: 50, unitCost: 30 }] });
    await purchases.receive(ownerId, p2.id);
    const inv = await prisma.inventory.findUnique({ where: { productId_branchId: { productId, branchId } } });
    expect(inv!.quantity).toBe(100);
    expect(inv!.avgCost).toBeCloseTo(25, 8);
  });

  it('confirm with insufficient stock rolls back (409, no partial order)', async () => {
    await expect(orders.confirm(ownerId, { lines: [{ productId, qty: 99999 }], type: 'pickup' })).rejects.toMatchObject({ status: 409 });
    const count = await prisma.order.count({ where: { items: { some: { productId } } } });
    expect(count).toBe(0);
  });

  it('confirm decrements stock and writes movements', async () => {
    const o = await orders.confirm(ownerId, { lines: [{ productId, qty: 2 }], type: 'pickup' });
    expect(o!.status).toBe('confirmed');
    expect(o!.total).toBe(100);
    const inv = await prisma.inventory.findUnique({ where: { productId_branchId: { productId, branchId } } });
    expect(inv!.quantity).toBe(98);
    // historical price snapshot survives product price change
    await prisma.product.update({ where: { id: productId }, data: { basePrice: 999 } });
    const item = await prisma.orderItem.findFirst({ where: { orderId: o!.id } });
    expect(item!.unitPrice).toBe(50);
  });
});
