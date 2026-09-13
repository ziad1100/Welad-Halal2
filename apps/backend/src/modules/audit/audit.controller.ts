import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { AuditService } from './audit.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@RequireLevel(50)
@Controller('api/audit')
export class AuditController {
  constructor(private audit: AuditService) {}

  @Get()
  list(@Query('entity') entity?: string, @Query('userId') userId?: string) {
    return this.audit.list(entity, userId);
  }
}
