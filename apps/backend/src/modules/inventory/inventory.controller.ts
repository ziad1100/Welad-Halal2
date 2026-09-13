import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InventoryService } from './inventory.service';

@UseGuards(JwtAuthGuard)
@Controller('api/inventory')
export class InventoryController {
  constructor(private inv: InventoryService) {}

  @Get()
  live(@Query('branchId') branchId?: string) {
    return this.inv.live(branchId);
  }

  @Get('movements')
  movements(@Query('productId') productId?: string) {
    return this.inv.movements(productId);
  }

  @Post('adjust')
  adjust(@Req() req: any, @Body() dto: any) {
    return this.inv.adjust(req.user.sub, dto.productId, dto.branchId, Number(dto.newQty), dto.note);
  }
}
