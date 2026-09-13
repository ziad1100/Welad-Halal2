import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { SettingsService } from './settings.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@Controller('api/settings')
export class SettingsController {
  constructor(private settings: SettingsService) {}

  @Get()
  all() {
    return this.settings.all();
  }

  @RequireLevel(50)
  @Post()
  set(@Req() req: any, @Body() dto: any) {
    return this.settings.set(req.user.sub, dto.key, String(dto.value));
  }
}
