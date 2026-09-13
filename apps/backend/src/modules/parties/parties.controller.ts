import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionLevelGuard } from '../../common/guards/permission-level.guard';
import { RequireLevel } from '../../common/decorators/require-level.decorator';
import { PartiesService } from './parties.service';

@UseGuards(JwtAuthGuard, PermissionLevelGuard)
@Controller('api/parties')
export class PartiesController {
  constructor(private parties: PartiesService) {}

  @Get()
  list(@Query('type') type?: string) {
    return this.parties.list(type);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.parties.get(id);
  }

  @RequireLevel(50)
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    return this.parties.create(req.user.sub, dto);
  }

  @RequireLevel(50)
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.parties.update(req.user.sub, id, dto);
  }

  @RequireLevel(50)
  @Post(':id/loyalty')
  loyalty(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    return this.parties.addLoyalty(req.user.sub, id, Number(dto.points ?? 0));
  }
}
