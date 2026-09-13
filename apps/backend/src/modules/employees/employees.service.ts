import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.employee.findMany({ include: { user: { select: { id: true, username: true, fullName: true, role: true, isActive: true } } }, orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.employee.findUnique({ where: { id }, include: { user: true, shifts: { orderBy: { openedAt: 'desc' }, take: 50 } } });
  }

  async create(actorId: string, dto: { userId: string; position?: string; phone?: string; salary?: number }) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    const e = await this.prisma.employee.create({ data: { userId: dto.userId, position: dto.position ?? null, phone: dto.phone ?? null, salary: dto.salary ?? null } });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'employee.create', entity: 'Employee', entityId: e.id, after: { userId: dto.userId } as any } });
    return e;
  }

  async update(actorId: string, id: string, dto: any) {
    const before = await this.prisma.employee.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Employee not found');
    const e = await this.prisma.employee.update({ where: { id }, data: dto });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'employee.update', entity: 'Employee', entityId: id, before: before as any, after: dto as any } });
    return e;
  }
}
