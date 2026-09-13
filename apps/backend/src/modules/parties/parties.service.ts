import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PartiesService {
  constructor(private prisma: PrismaService) {}

  list(type?: string) {
    return this.prisma.party.findMany({
      where: type ? { type: type as any } : {},
      orderBy: { name: 'asc' },
      take: 500,
    });
  }

  get(id: string) {
    return this.prisma.party.findUnique({ where: { id } });
  }

  async create(actorId: string, dto: any) {
    const p = await this.prisma.party.create({
      data: {
        type: dto.type ?? 'customer',
        name: dto.name,
        phone: dto.phone ?? null,
        address: dto.address ?? null,
      },
    });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'party.create', entity: 'Party', entityId: p.id, after: { name: p.name } as any } });
    return p;
  }

  async update(actorId: string, id: string, dto: any) {
    const before = await this.prisma.party.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Party not found');
    const p = await this.prisma.party.update({ where: { id }, data: dto });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'party.update', entity: 'Party', entityId: id, before: before as any, after: dto as any } });
    return p;
  }

  async addLoyalty(actorId: string, id: string, points: number) {
    const p = await this.prisma.party.update({ where: { id }, data: { loyaltyPoints: { increment: Math.trunc(points) } } });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'party.loyalty', entity: 'Party', entityId: id, after: { points } as any } });
    return p;
  }
}
