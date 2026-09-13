// Role-based post-login routing — single source of truth (tested).
// employee → Cashier only; manager/owner → Orders shell; forced pw change first.
export function routeForRole(role: string, forcePasswordChange: boolean): string {
  if (forcePasswordChange) return '/change-password';
  if (role === 'employee') return '/cashier';
  return '/orders';
}

// Minimum permission level per route (mirrors App.tsx ProtectedRoute levels).
export function minLevelFor(path: string): number {
  const managerOnly = ['/orders', '/inventory', '/purchases', '/suppliers', '/manufacturing', '/reports', '/hr', '/admin'];
  if (managerOnly.includes(path)) return 50;
  return 10;
}
