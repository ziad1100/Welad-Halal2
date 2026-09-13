import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProductsService } from './products.service';

@UseGuards(JwtAuthGuard)
@Controller('api/products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  list(@Query('search') search?: string, @Query('categoryId') categoryId?: string) {
    return this.products.list(search, categoryId);
  }

  @Get('barcode/:code')
  byBarcode(@Param('code') code: string) {
    return this.products.byBarcode(code);
  }

  @Post()
  create(@Body() dto: any) {
    return this.products.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.products.update(id, dto);
  }
}
