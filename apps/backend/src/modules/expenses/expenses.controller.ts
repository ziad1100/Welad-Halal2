import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExpensesService } from './expenses.service';

@UseGuards(JwtAuthGuard)
@Controller('api/expenses')
export class ExpensesController {
  constructor(private expenses: ExpensesService) {}

  @Get()
  list(@Query('branchId') branchId?: string) {
    return this.expenses.list(branchId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.expenses.create(req.user.sub, dto);
  }
}
