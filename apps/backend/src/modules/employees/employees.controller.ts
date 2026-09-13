import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { EmployeesService } from './employees.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@Controller('api/employees')
export class EmployeesController {
  constructor(private employees: EmployeesService) {}

  @RequireLevel(50)
  @Get()
  list() {
    return this.employees.list();
  }

  @RequireLevel(50)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.employees.get(id);
  }

  @RequireLevel(50)
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.employees.create(req.user.sub, dto);
  }

  @RequireLevel(50)
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.employees.update(req.user.sub, id, dto);
  }
}
