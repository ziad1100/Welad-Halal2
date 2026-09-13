import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }
  pinned() {
    return this.prisma.category.findMany({ where: { isPinned: true }, orderBy: { name: 'asc' } });
  }
  create(name: string, isPinned = false) {
    return this.prisma.category.create({ data: { name, isPinned } });
  }
  update(id: string, dto: any) {
    return this.prisma.category.update({ where: { id }, data: dto });
  }
}
