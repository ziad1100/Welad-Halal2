import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';

@UseGuards(JwtAuthGuard)
@Controller('api/categories')
export class CategoriesController {
  constructor(private cats: CategoriesService) {}

  @Get()
  list() {
    return this.cats.list();
  }

  @Get('pinned')
  pinned() {
    return this.cats.pinned();
  }

  @Post()
  create(@Body() dto: any) {
    return this.cats.create(dto.name, dto.isPinned ?? false);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.cats.update(id, dto);
  }
}
