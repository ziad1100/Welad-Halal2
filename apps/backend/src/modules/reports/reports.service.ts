import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async dailySales(days = 14) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const orders = await this.prisma.order.findMany({ where: { status: 'confirmed', createdAt: { gte: since } }, select: { total: true, createdAt: true } });
    const byDay = new Map<string, { count: number; total: number }>();
    for (const o of orders) {
      const d = o.createdAt.toISOString().slice(0, 10);
      const e = byDay.get(d) ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += o.total;
      byDay.set(d, e);
    }
    return [...byDay.entries()].map(([day, v]) => ({ day, ...v })).sort((a, b) => a.day.localeCompare(b.day));
  }

  async topItems(limit = 20) {
    const items = await this.prisma.orderItem.groupBy({ by: ['productId', 'productName'], _sum: { qty: true, lineTotal: true }, orderBy: { _sum: { qty: 'desc' } }, take: limit });
    return items.map((i) => ({ productId: i.productId, name: i.productName, qty: i._sum.qty ?? 0, revenue: i._sum.lineTotal ?? 0 }));
  }

  async inventoryValue() {
    const inv = await this.prisma.inventory.findMany({ include: { product: { select: { name: true } } } });
    const total = inv.reduce((s, i) => s + i.quantity * i.avgCost, 0);
    return { lines: inv.length, totalValue: total };
  }

  async expensesTotal(from?: string) {
    const gte = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30));
    const agg = await this.prisma.expense.aggregate({ where: { createdAt: { gte } }, _sum: { amount: true }, _count: true });
    return { count: agg._count, total: agg._sum.amount ?? 0 };
  }

  shiftSummary() {
    return this.prisma.shift.findMany({ orderBy: { openedAt: 'desc' }, take: 50, include: { employee: { include: { user: { select: { username: true } } } } } });
  }
}
