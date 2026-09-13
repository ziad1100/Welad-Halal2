import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  live(branchId?: string) {
    return this.prisma.inventory.findMany({
      where: branchId ? { branchId } : {},
      include: { product: { include: { category: true } }, branch: true },
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });
  }

  movements(productId?: string) {
    return this.prisma.stockMovement.findMany({
      where: productId ? { productId } : {},
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async adjust(actorId: string, productId: string, branchId: string, newQty: number, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      const inv = await tx.inventory.findUnique({ where: { productId_branchId: { productId, branchId } } });
      const before = inv?.quantity ?? 0;
      const delta = newQty - before;
      const updated = inv
        ? await tx.inventory.update({ where: { id: inv.id }, data: { quantity: newQty } })
        : await tx.inventory.create({ data: { productId, branchId, quantity: newQty, avgCost: 0 } });
      await tx.stockMovement.create({ data: { productId, branchId, type: 'adjustment', qtyDelta: delta, note: note ?? 'manual adjustment' } });
      await tx.auditLog.create({ data: { userId: actorId, action: 'stock.adjust', entity: 'Inventory', entityId: updated.id, before: { qty: before } as any, after: { qty: newQty } as any } });
      return updated;
    });
  }
}
