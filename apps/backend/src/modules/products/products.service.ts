import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

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
    // Redis cache first (external fallback stays non-blocking in frontend)
    const cached = await this.cache.get(`bc:${c}`);
    if (cached) return JSON.parse(cached);
    // exact match: Product.barcode first, then ProductUnit.barcode
    const product = await this.prisma.product.findFirst({
      where: { barcode: c, isActive: true },
      include: { category: true, units: { where: { isActive: true } }, inventory: true },
    });
    if (product) {
      const res = { product, unit: null };
      await this.cache.set(`bc:${c}`, JSON.stringify(res));
      return res;
    }
    const unit = await this.prisma.productUnit.findFirst({
      where: { barcode: c, isActive: true },
      include: { product: { include: { category: true, units: { where: { isActive: true } }, inventory: true } } },
    });
    if (unit) {
      const res = { product: unit.product, unit: { ...unit, product: undefined } };
      await this.cache.set(`bc:${c}`, JSON.stringify(res));
      return res;
    }
    throw new NotFoundException('Barcode not found');
  }

  async create(dto: any) {
    const { units, ...rest } = dto;
    const p = await this.prisma.product.create({
      data: {
        ...rest,
        units: units ? { create: units } : undefined,
      },
      include: { units: true },
    });
    if (p.barcode) await this.cache.del(`bc:${p.barcode}`);
    return p;
  }

  async update(id: string, dto: any) {
    const { units: _u, ...rest } = dto;
    const p = await this.prisma.product.update({ where: { id }, data: rest });
    if (p.barcode) await this.cache.del(`bc:${p.barcode}`);
    return p;
  }
}
