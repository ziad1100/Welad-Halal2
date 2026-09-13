import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  list(entity?: string, userId?: string) {
    return this.prisma.auditLog.findMany({
      where: { ...(entity ? { entity } : {}), ...(userId ? { userId } : {}) },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
  }
}
