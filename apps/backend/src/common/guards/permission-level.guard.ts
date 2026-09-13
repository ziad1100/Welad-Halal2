import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionLevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<number>('requiredLevel', context.getHandler());
    if (required === undefined || required === null) return true;
    const user = context.switchToHttp().getRequest().user;
    return !!user && user.permissionLevel >= required;
  }
}
