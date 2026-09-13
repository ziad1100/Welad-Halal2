import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@RequireLevel(50)
@Controller('api/reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Get('daily-sales')
  daily(@Query('days') days?: string) {
    return this.reports.dailySales(Number(days ?? 14));
  }

  @Get('top-items')
  top(@Query('limit') limit?: string) {
    return this.reports.topItems(Number(limit ?? 20));
  }

  @Get('inventory-value')
  invVal() {
    return this.reports.inventoryValue();
  }

  @Get('expenses')
  expenses(@Query('from') from?: string) {
    return this.reports.expensesTotal(from);
  }

  @Get('shifts')
  shifts() {
    return this.reports.shiftSummary();
  }
}
