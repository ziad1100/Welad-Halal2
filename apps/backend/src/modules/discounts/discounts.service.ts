import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { computeDiscountAmount, discountError } from '../../common/utils/discount';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(actorId: string, dto: any) {
    if (!dto.code) throw new BadRequestException('code required');
    const d = await this.prisma.discountCode.create({
      data: {
        code: String(dto.code).trim(),
        type: dto.type ?? 'percentage',
        value: Number(dto.value ?? 0),
        validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
        validTo: dto.validTo ? new Date(dto.validTo) : null,
        usageLimit: dto.usageLimit ?? null,
      },
    });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'discount.create', entity: 'DiscountCode', entityId: d.id, after: { code: d.code } as any } });
    return d;
  }

  // Server-side validation used by cashier before confirm
  async validate(code: string, subtotal: number) {
    const dc = await this.prisma.discountCode.findUnique({ where: { code } });
    const err = discountError(dc);
    if (err) throw new BadRequestException(err);
    const amount = computeDiscountAmount(dc!.type, dc!.value, subtotal);
    return { code: dc!.code, type: dc!.type, amount };
  }
}
