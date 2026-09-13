import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  all() {
    return this.prisma.systemSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async set(actorId: string, key: string, value: string) {
    const before = await this.prisma.systemSetting.findUnique({ where: { key } });
    const s = await this.prisma.systemSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
    await this.prisma.auditLog.create({ data: { userId: actorId, action: 'setting.update', entity: 'SystemSetting', entityId: s.id, before: before as any, after: { key, value } as any } });
    return s;
  }
}
