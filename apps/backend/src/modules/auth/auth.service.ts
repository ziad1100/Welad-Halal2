import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { normalizeUsername } from '../../common/utils/username';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const normalized = normalizeUsername(dto.username);
    const user = await this.prisma.user.findFirst({
      where: {
        username: { equals: normalized, mode: 'insensitive' },
        isActive: true,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      permissionLevel: user.permissionLevel,
      isOwner: user.isOwner,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        permissionLevel: user.permissionLevel,
        isOwner: user.isOwner,
        forcePasswordChange: user.forcePasswordChange,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('Unauthorized');
    const { passwordHash: _h, ...safe } = user;
    return safe;
  }
}
