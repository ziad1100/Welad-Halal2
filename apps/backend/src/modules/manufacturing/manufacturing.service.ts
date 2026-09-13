import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ManufacturingService {
  constructor(private prisma: PrismaService) {}

  boms(compositeId?: string) {
    return this.prisma.bomItem.findMany({ where: compositeId ? { compositeId } : {}, include: { raw: true, composite: true } });
  }

  addBom(actorId: string, dto: { compositeId: string; rawId: string; qtyNeeded: number }) {
    return this.prisma.bomItem.create({ data: dto }).then(async (b) => {
      await this.prisma.auditLog.create({ data: { userId: actorId, action: 'bom.create', entity: 'BomItem', entityId: b.id, after: dto as any } });
      return b;
    });
  }

  orders() {
    return this.prisma.manufacturingOrder.findMany({ include: { product: true }, orderBy: { createdAt: 'desc' }, take: 200 });
  }

  createOrder(actorId: string, dto: { productId: string; qty: number }) {
    return this.prisma.manufacturingOrder.create({ data: { productId: dto.productId, qty: dto.qty } }).then(async (o) => {
      await this.prisma.auditLog.create({ data: { userId: actorId, action: 'mfg.create', entity: 'ManufacturingOrder', entityId: o.id, after: dto as any } });
      return o;
    });
  }

  async complete(actorId: string, id: string, branchId?: string) {
    const o = await this.prisma.manufacturingOrder.findUnique({ where: { id } });
    if (!o) throw new NotFoundException('Order not found');
    if (o.status === 'done') throw new BadRequestException('Already completed');
    const branch = branchId ?? (await this.prisma.branch.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }))?.id;
    if (!branch) throw new BadRequestException('No active branch');
    const bom = await this.prisma.bomItem.findMany({ where: { compositeId: o.productId } });
    if (!bom.length) throw new BadRequestException('No BOM defined');
    await this.prisma.$transaction(async (tx) => {
      for (const b of bom) {
        const need = b.qtyNeeded * o.qty;
        const inv = await tx.inventory.findUnique({ where: { productId_branchId: { productId: b.rawId, branchId: branch } } });
        if ((inv?.quantity ?? 0) < need) throw new ConflictException(`Insufficient raw stock (${b.rawId})`);
        await tx.inventory.update({ where: { id: inv!.id }, data: { quantity: inv!.quantity - need } });
        await tx.stockMovement.create({ data: { productId: b.rawId, branchId: branch, type: 'manufacturing_out', qtyDelta: -need, refId: o.id } });
      }
      const fin = await tx.inventory.findUnique({ where: { productId_branchId: { productId: o.productId, branchId: branch } } });
      if (fin) await tx.inventory.update({ where: { id: fin.id }, data: { quantity: fin.quantity + o.qty } });
      else await tx.inventory.create({ data: { productId: o.productId, branchId: branch, quantity: o.qty, avgCost: 0 } });
      await tx.stockMovement.create({ data: { productId: o.productId, branchId: branch, type: 'manufacturing_in', qtyDelta: o.qty, refId: o.id } });
      await tx.manufacturingOrder.update({ where: { id }, data: { status: 'done' } });
    });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'mfg.complete', entity: 'ManufacturingOrder', entityId: id } });
    return this.prisma.manufacturingOrder.findUnique({ where: { id } });
  }
}
