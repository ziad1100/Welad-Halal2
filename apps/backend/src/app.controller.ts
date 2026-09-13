import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('api/health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('api/health/database')
  async dbHealth() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'connected' };
  }
}
