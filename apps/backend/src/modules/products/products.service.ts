import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list(search?: string, categoryId?: string) {
    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { barcode: { equals: search } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const products = await this.prisma.product.findMany({
      where,
      include: { category: true, units: { where: { isActive: true } }, inventory: true },
      orderBy: { name: 'asc' },
      take: 200,
    });
    return products.map((p) => ({
      ...p,
      categoryName: p.category?.name ?? null,
      stockQty: p.inventory.reduce((s, i) => s + i.quantity, 0),
    }));
  }

  async byBarcode(code: string) {
    const c = code.trim();
    // exact match: Product.barcode first, then ProductUnit.barcode
    const product = await this.prisma.product.findFirst({
      where: { barcode: c, isActive: true },
      include: { category: true, units: { where: { isActive: true } }, inventory: true },
    });
    if (product) return { product, unit: null };
    const unit = await this.prisma.productUnit.findFirst({
      where: { barcode: c, isActive: true },
      include: { product: { include: { category: true, units: { where: { isActive: true } }, inventory: true } } },
    });
    if (unit) return { product: unit.product, unit };
    // external fallback intentionally non-blocking: return 404, frontend may query OpenFoodFacts
    throw new NotFoundException('Barcode not found');
  }

  create(dto: any) {
    const { units, ...rest } = dto;
    return this.prisma.product.create({
      data: {
        ...rest,
        units: units ? { create: units } : undefined,
      },
      include: { units: true },
    });
  }

  update(id: string, dto: any) {
    const { units: _u, ...rest } = dto;
    return this.prisma.product.update({ where: { id }, data: rest });
  }
}
