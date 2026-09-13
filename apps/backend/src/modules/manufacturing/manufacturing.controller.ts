import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { ManufacturingService } from './manufacturing.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@Controller('api/manufacturing')
export class ManufacturingController {
  constructor(private mfg: ManufacturingService) {}

  @RequireLevel(50)
  @Get('bom')
  boms(@Query('compositeId') compositeId?: string) {
    return this.mfg.boms(compositeId);
  }

  @RequireLevel(50)
  @Post('bom')
  addBom(@Req() req: any, @Body() dto: any) {
    return this.mfg.addBom(req.user.sub, dto);
  }

  @RequireLevel(50)
  @Get('orders')
  orders() {
    return this.mfg.orders();
  }

  @RequireLevel(50)
  @Post('orders')
  create(@Req() req: any, @Body() dto: any) {
    return this.mfg.createOrder(req.user.sub, dto);
  }

  @RequireLevel(50)
  @Post('orders/:id/complete')
  complete(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.mfg.complete(req.user.sub, id, dto.branchId);
  }
}
