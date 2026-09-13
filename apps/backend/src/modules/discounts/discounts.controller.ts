import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { DiscountsService } from './discounts.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@Controller('api/discounts')
export class DiscountsController {
  constructor(private discounts: DiscountsService) {}

  @RequireLevel(50)
  @Get()
  list() {
    return this.discounts.list();
  }

  @RequireLevel(50)
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.discounts.create(req.user.sub, dto);
  }

  @Get('validate')
  validate(@Query('code') code: string, @Query('subtotal') subtotal: string) {
    return this.discounts.validate(code, Number(subtotal ?? 0));
  }
}
