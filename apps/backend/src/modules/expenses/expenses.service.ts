import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  list(branchId?: string) {
    return this.prisma.expense.findMany({ where: branchId ? { branchId } : {}, orderBy: { createdAt: 'desc' }, take: 300 });
  }

  async create(actorId: string, dto: { branchId?: string; category: string; amount: number; note?: string }) {
    if (!dto.category || !(dto.amount > 0)) throw new BadRequestException('Invalid expense');
    const branchId = dto.branchId ?? (await this.prisma.branch.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }))?.id;
    if (!branchId) throw new BadRequestException('No active branch');
    const e = await this.prisma.expense.create({ data: { branchId, category: dto.category, amount: dto.amount, note: dto.note ?? null } });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'expense.create', entity: 'Expense', entityId: e.id, after: dto as any } });
    return e;
  }
}
