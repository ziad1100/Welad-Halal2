import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.purchase.findMany({
      include: { items: true, supplier: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async create(actorId: string, dto: { supplierId: string; branchId?: string; items: { productId: string; unitId?: string; qty: number; unitCost: number }[] }) {
    if (!dto.items?.length) throw new BadRequestException('Empty purchase');
    const branchId = dto.branchId ?? (await this.prisma.branch.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }))?.id;
    if (!branchId) throw new BadRequestException('No active branch');
    const total = dto.items.reduce((s, i) => s + i.qty * i.unitCost, 0);
    const p = await this.prisma.purchase.create({
      data: {
        supplierId: dto.supplierId,
        branchId,
        total,
        items: { create: dto.items.map((i) => ({ productId: i.productId, unitId: i.unitId ?? null, qty: i.qty, unitCost: i.unitCost, lineTotal: i.qty * i.unitCost })) },
      },
      include: { items: true },
    });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'purchase.create', entity: 'Purchase', entityId: p.id, after: { total } as any } });
    return p;
  }

  // Receive stock: average-cost update, transactional
  async receive(actorId: string, id: string) {
    const p = await this.prisma.purchase.findUnique({ where: { id }, include: { items: true } });
    if (!p) throw new NotFoundException('Purchase not found');
    if (p.isReceived) throw new BadRequestException('Already received');
    await this.prisma.$transaction(async (tx) => {
      for (const it of p.items) {
        const inv = await tx.inventory.findUnique({ where: { productId_branchId: { productId: it.productId, branchId: p.branchId } } });
        const oldQty = inv?.quantity ?? 0;
        const oldCost = inv?.avgCost ?? it.unitCost;
        const newQty = oldQty + it.qty;
        const newCost = newQty > 0 ? (oldQty * oldCost + it.qty * it.unitCost) / newQty : it.unitCost;
        if (inv) await tx.inventory.update({ where: { id: inv.id }, data: { quantity: newQty, avgCost: newCost } });
        else await tx.inventory.create({ data: { productId: it.productId, branchId: p.branchId, quantity: newQty, avgCost: newCost } });
        await tx.stockMovement.create({ data: { productId: it.productId, branchId: p.branchId, type: 'purchase', qtyDelta: it.qty, costAtTime: it.unitCost, refId: p.id } });
      }
      await tx.purchase.update({ where: { id }, data: { isReceived: true } });
    });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'purchase.receive', entity: 'Purchase', entityId: id } });
    return this.prisma.purchase.findUnique({ where: { id }, include: { items: true } });
  }
}
