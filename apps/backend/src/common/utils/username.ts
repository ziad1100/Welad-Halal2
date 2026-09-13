// Username normalization — single source of truth for uniqueness checks + login.
// Usernames are plain ASCII Latin, never email: no "@" check, no email regex.
export function normalizeUsername(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

export function isValidUsername(raw: string): boolean {
  return normalizeUsername(raw).length >= 3;
}
