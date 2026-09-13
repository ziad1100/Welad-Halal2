import { describe, expect, it } from 'vitest';
import { PermissionLevelGuard } from './permission-level.guard';

function ctxWith(level: number | undefined, userLevel: number | undefined) {
  const reflector = {
    getAllAndOverride: (_key: string, _targets: unknown[]) => level,
  } as any;
  const guard = new PermissionLevelGuard(reflector);
  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => ({ user: userLevel === undefined ? undefined : { permissionLevel: userLevel } }) }),
  } as any;
  return guard.canActivate(context);
}

describe('PermissionLevelGuard', () => {
  it('allows public routes (no level required)', () => {
    expect(ctxWith(undefined, undefined)).toBe(true);
  });
  it('enforces owner level 100', () => {
    expect(ctxWith(100, 100)).toBe(true);
    expect(ctxWith(100, 50)).toBe(false);
    expect(ctxWith(100, 10)).toBe(false);
  });
  it('enforces manager level 50', () => {
    expect(ctxWith(50, 100)).toBe(true);
    expect(ctxWith(50, 50)).toBe(true);
    expect(ctxWith(50, 10)).toBe(false);
  });
  it('denies anonymous on guarded routes', () => {
    expect(ctxWith(50, undefined)).toBe(false);
  });
});
