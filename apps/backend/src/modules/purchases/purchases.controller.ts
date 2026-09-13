import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { PurchasesService } from './purchases.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@Controller('api/purchases')
export class PurchasesController {
  constructor(private purchases: PurchasesService) {}

  @RequireLevel(50)
  @Get()
  list() {
    return this.purchases.list();
  }

  @RequireLevel(50)
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.purchases.create(req.user.sub, dto);
  }

  @RequireLevel(50)
  @Post(':id/receive')
  receive(@Req() req: any, @Param('id') id: string) {
    return this.purchases.receive(req.user.sub, id);
  }
}
