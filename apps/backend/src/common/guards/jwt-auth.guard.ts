import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) throw err || new UnauthorizedException('Unauthorized');
    return user;
  }
}
