import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ShiftsService } from './shifts.service';

@UseGuards(JwtAuthGuard)
@Controller('api/shifts')
export class ShiftsController {
  constructor(private shifts: ShiftsService) {}

  @Get()
  list(@Query('employeeId') employeeId?: string) {
    return this.shifts.list(employeeId);
  }

  @Post('open')
  open(@Req() req: any, @Body() dto: any) {
    return this.shifts.openWithCash(req.user.sub, Number(dto.openingCash ?? 0));
  }

  @Post(':id/close')
  close(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.shifts.close(req.user.sub, id, Number(dto.closingCash ?? 0));
  }
}
